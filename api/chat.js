const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash';

function trimText(text, maxLen = 950) {
    const t = (text || '').replace(/\s+/g, ' ').trim();
    if (t.length <= maxLen) return t;
    const cut = t.slice(0, maxLen);
    const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
    return (lastStop > maxLen * 0.55 ? cut.slice(0, lastStop + 1) : cut.trim()) + '...';
}

function buildPrompt(question, contexts) {
    const contextText = contexts.map((c, i) =>
        `[Đoạn tham khảo ${i + 1}]
${trimText(String(c.text || '').replace(/\[Trang\s*\d+\]/gi, ''), 1100)}`
    ).join('\n\n');

    return `Mình là trợ lý học tập môn Kinh tế chính trị Mác - Lênin cho sinh viên.

CÁCH TRẢ LỜI:
- Trả lời tự nhiên như trợ giảng, thân thiện và dễ hiểu.
- Không nhắc tên file PDF, không nhắc trang, không nói “theo tài liệu”, “trong dữ liệu”, “nguồn”.
- Không trích nguyên văn dài; hãy tự diễn giải lại ý chính.
- Nếu hỏi khái niệm: nêu khái niệm ngắn + giải thích + ví dụ đơn giản.
- Nếu hỏi so sánh: trình bày gọn bằng các ý hoặc bảng.
- Nếu hỏi câu tư duy/vận dụng: phân tích logic từng bước rồi chốt kết luận.
- Nếu dữ liệu chưa đủ rõ, hãy nói nhẹ nhàng rằng mình chưa thấy đủ căn cứ trong tài liệu hiện có.
- Câu trả lời nên vừa đủ, không quá dài, ưu tiên 3-6 ý chính.

CÂU HỎI CỦA NGƯỜI DÙNG:
${question}

NỘI DUNG THAM KHẢO NỘI BỘ:
${contextText}`;
}

async function readJsonBody(req) {
    if (req.body) {
        return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }

    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', chunk => {
            raw += chunk;
        });
        req.on('end', () => {
            try {
                resolve(raw ? JSON.parse(raw) : {});
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({
            error: 'Thiếu biến môi trường GEMINI_API_KEY trên Vercel.'
        });
    }

    try {
        const body = await readJsonBody(req);
        const question = String(body.question || '').trim();
        const contexts = Array.isArray(body.contexts) ? body.contexts.slice(0, 5) : [];

        if (!question) {
            return res.status(400).json({ error: 'Thiếu câu hỏi.' });
        }

        const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

        const geminiRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: buildPrompt(question, contexts) }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    topP: 0.8,
                    maxOutputTokens: 2048
                }
            })
        });

        const data = await geminiRes.json().catch(() => ({}));
        if (!geminiRes.ok) {
            return res.status(geminiRes.status).json({
                error: data?.error?.message || 'Không gọi được Gemini API.'
            });
        }

        const answer = data?.candidates?.[0]?.content?.parts
            ?.map(part => part.text)
            .join('\n')
            .trim();

        return res.status(200).json({
            answer: answer || 'Gemini chưa trả về nội dung. Bạn thử hỏi lại ngắn hơn nha.'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Lỗi xử lý yêu cầu chat.' });
    }
};
