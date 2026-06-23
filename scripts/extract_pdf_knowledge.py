"""Extract text from PDFs and build chat knowledge base JSON."""
import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

PDF_PATHS = [
    Path(r"d:\Báo cáo lý luận giá trị thặng dư Mác.pdf"),
    Path(r"d:\GIAO TRINH KINH TE CHINH TRI MAC - LENIN (Quoc gia) (1).pdf"),
]

OUTPUT = Path(__file__).resolve().parent.parent / "data" / "chat-knowledge.json"

CHUNK_SIZE = 1200
CHUNK_OVERLAP = 200


def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def clean_text(text: str) -> str:
    text = text.replace("\r", "\n")
    text = re.sub(r"(\w)\n(\w)", r"\1 \2", text)
    text = re.sub(r"\n+", " ", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def extract_pdf(path: Path) -> str:
    reader = PdfReader(str(path))
    parts = []
    for page in reader.pages:
        t = page.extract_text() or ""
        if t.strip():
            parts.append(clean_text(t))
    return "\n\n".join(parts)


def split_chunks(text: str, source: str) -> list[dict]:
    text = clean_text(text)
    chunks = []
    start = 0
    idx = 0
    while start < len(text):
        end = min(start + CHUNK_SIZE, len(text))
        if end < len(text):
            break_at = text.rfind(". ", start, end)
            if break_at == -1:
                break_at = text.rfind("\n", start, end)
            if break_at > start + CHUNK_SIZE // 2:
                end = break_at + 1
        chunk = text[start:end].strip()
        if len(chunk) >= 80:
            chunks.append({
                "id": f"{source}-{idx}",
                "source": source,
                "text": chunk,
                "keywords": build_keywords(chunk),
            })
            idx += 1
        start = max(end - CHUNK_OVERLAP, start + 1)
        if end >= len(text):
            break
    return chunks


def build_keywords(text: str) -> list[str]:
    normalized = normalize(text)
    tokens = re.findall(r"[a-zA-Zà-ỹÀ-Ỹ0-9']+", normalized)
    stop = {
        "và", "của", "là", "các", "cho", "trong", "với", "được", "một", "như",
        "theo", "từ", "này", "đó", "khi", "cũng", "không", "có", "để", "trên",
        "nhưng", "hay", "hoặc", "về", "bởi", "nếu", "thì", "đã", "sẽ", "rằng",
    }
    freq: dict[str, int] = {}
    for t in tokens:
        if len(t) < 3 or t in stop:
            continue
        freq[t] = freq.get(t, 0) + 1
    ranked = sorted(freq.items(), key=lambda x: (-x[1], -len(x[0])))
    return [w for w, _ in ranked[:12]]


def main() -> None:
    all_chunks: list[dict] = []
    meta = {"sources": []}

    for pdf in PDF_PATHS:
        if not pdf.exists():
            print(f"Missing: {pdf}", file=sys.stderr)
            sys.exit(1)
        print(f"Extracting: {pdf.name}")
        raw = extract_pdf(pdf)
        source = pdf.stem
        chunks = split_chunks(raw, source)
        print(f"  -> {len(chunks)} chunks, {len(raw)} chars")
        all_chunks.extend(chunks)
        meta["sources"].append({"name": pdf.name, "chunks": len(chunks)})

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {"meta": meta, "chunks": all_chunks}
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {len(all_chunks)} chunks -> {OUTPUT}")


if __name__ == "__main__":
    main()
