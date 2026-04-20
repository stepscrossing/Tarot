import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { ZhipuAI } from 'zhipuai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const zhipuApiKey = process.env.ZHIPU_API_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const zhipu = zhipuApiKey ? new ZhipuAI({ apiKey: zhipuApiKey }) : null;

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/readings', async (req, res) => {
  const sessionId = typeof req.body?.sessionId === 'string' ? req.body.sessionId : null;
  const cards = Array.isArray(req.body?.cards) ? req.body.cards : null;

  if (!sessionId || sessionId.length < 8) {
    return res.status(400).json({ error: 'Invalid sessionId' });
  }
  if (!cards || cards.length !== 3) {
    return res.status(400).json({ error: 'cards must be an array of 3 items' });
  }

  const { data, error } = await supabase
    .from('readings')
    .insert({ session_id: sessionId, cards })
    .select('id, session_id, cards, created_at')
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    id: data.id,
    sessionId: data.session_id,
    cards: data.cards,
    createdAt: data.created_at,
  });
});

app.post('/api/interpret', async (req, res) => {
  const { cards } = req.body;

  if (!cards || !Array.isArray(cards) || cards.length !== 3) {
    return res.status(400).json({ error: 'Invalid cards data' });
  }

  if (!zhipu) {
    return res.status(503).json({ error: 'AI service not configured' });
  }

  try {
    const cardDescriptions = cards.map(c => 
      `${c.name} (${c.isReversed ? '逆位' : '正位'})`
    ).join(', ');

    const prompt = `你是一位神秘而专业的塔罗牌占卜师。求问者抽到了以下三张牌：${cardDescriptions}。
    这个牌阵代表：1. 过去/背景，2. 现在/状况，3. 未来/结果。
    请用**简体中文**为求问者提供一段富有洞察力、神秘感但又脚踏实地的解读。
    请重点分析牌与牌之间的流变和叙事联系。
    字数控制在 300 字左右。分 3-4 个自然段输出。`;

    const response = await zhipu.chat.completions.create({
      model: "glm-4-flash",
      messages: [
        { role: "user", content: prompt }
      ],
      stream: false,
    });

    const interpretation = response.choices[0]?.message?.content || "The mists are too thick to see clearly...";
    return res.json({ interpretation });
  } catch (error) {
    console.error('Zhipu AI Error:', error);
    return res.status(500).json({ error: 'Failed to generate interpretation' });
  }
});

app.get('/api/readings', async (req, res) => {
  const sessionId = typeof req.query?.sessionId === 'string' ? req.query.sessionId : null;
  const limitRaw = typeof req.query?.limit === 'string' ? req.query.limit : null;
  const limit = limitRaw ? Number(limitRaw) : 20;

  if (!sessionId || sessionId.length < 8) {
    return res.status(400).json({ error: 'Invalid sessionId' });
  }
  if (!Number.isFinite(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ error: 'Invalid limit' });
  }

  const { data, error } = await supabase
    .from('readings')
    .select('id, session_id, cards, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(
    (data ?? []).map((row) => ({
      id: row.id,
      sessionId: row.session_id,
      cards: row.cards,
      createdAt: row.created_at,
    })),
  );
});

app.get('/api/readings/:id', async (req, res) => {
  const sessionId = typeof req.query?.sessionId === 'string' ? req.query.sessionId : null;
  const id = req.params.id;

  if (!sessionId || sessionId.length < 8) {
    return res.status(400).json({ error: 'Invalid sessionId' });
  }

  const { data, error } = await supabase
    .from('readings')
    .select('id, session_id, cards, created_at')
    .eq('id', id)
    .eq('session_id', sessionId)
    .single();

  if (error) {
    const status = error.code === 'PGRST116' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }

  return res.json({
    id: data.id,
    sessionId: data.session_id,
    cards: data.cards,
    createdAt: data.created_at,
  });
});

const distPath = path.resolve(__dirname, '..', 'dist');
const distIndexPath = path.join(distPath, 'index.html');
if (fs.existsSync(distIndexPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (_req, res) => {
    res.sendFile(distIndexPath);
  });
}

const port = Number(process.env.PORT ?? 8787);
const server = app.listen(port, '0.0.0.0', () => {
  process.stdout.write(`Server listening on http://localhost:${port}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${port} is already in use.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
