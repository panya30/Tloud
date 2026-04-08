'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

// ─── UTM Hook ───
function useUtm() {
  const params = useSearchParams();
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
  };
}

// ─── Waitlist Form Component ───
function WaitlistForm({ variant = 'hero' }: { variant?: 'hero' | 'bottom' }) {
  const [lineId, setLineId] = useState('');
  const [business, setBusiness] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const utm = useUtm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lineId.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId: lineId.trim(), business: business.trim(), ...utm }),
      });
      if (!res.ok) throw new Error('Failed');
      // Facebook Pixel conversion event
      if (typeof window !== 'undefined' && (window as Record<string, unknown>).fbq) {
        (window as Record<string, unknown> & { fbq: (...args: unknown[]) => void }).fbq('track', 'Lead', { content_name: 'waitlist', value: 499, currency: 'THB' });
      }
    } catch {
      // Still show success to user — we logged to console in dev
    }
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className={`flex items-center gap-3 ${variant === 'hero' ? 'py-4' : 'py-3'}`}>
        <div className="w-8 h-8 bg-green-light flex items-center justify-center">
          <svg className="w-4 h-4 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="square" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-text">ลงทะเบียนสำเร็จ!</p>
          <p className="text-[13px] text-text-muted">เราจะติดต่อกลับทาง LINE เร็วๆ นี้</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={lineId}
          onChange={e => setLineId(e.target.value)}
          placeholder="LINE ID หรือเบอร์โทร"
          required
          className="flex-1 h-12 px-4 text-[15px] border border-border bg-white placeholder:text-text-light focus:outline-none focus:border-brand transition-colors"
        />
        <input
          type="text"
          value={business}
          onChange={e => setBusiness(e.target.value)}
          placeholder="ประเภทธุรกิจ"
          className="w-36 sm:w-44 h-12 px-4 text-[15px] border border-border bg-white placeholder:text-text-light focus:outline-none focus:border-brand transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-brand text-white text-[15px] font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
      >
        {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนรับสิทธิ์ใช้ก่อน — ฟรี'}
      </button>
      <p className="text-[12px] text-text-light text-center">ไม่ต้องใส่บัตรเครดิต · ใช้ฟรี 500 ข้อความ/เดือน</p>
    </form>
  );
}

// ─── Chat Demo Component ───
function ChatDemo() {
  const [step, setStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const messages = [
    { from: 'customer', text: 'สินค้ารุ่นนี้ราคาเท่าไหร่คะ', time: '14:32' },
    { from: 'ai', text: 'สินค้ารุ่น Premium X ราคา 1,290 บาทค่ะ 💙 ตอนนี้มีโปรลด 10% เหลือ 1,161 บาท พร้อมส่งเลยนะคะ สนใจสั่งเลยไหมคะ?', time: '14:32' },
    { from: 'customer', text: 'ส่งกี่วันถึงคะ ส่ง EMS ได้ไหม', time: '14:33' },
    { from: 'ai', text: 'ส่ง EMS ได้ค่ะ ถึงภายใน 1-2 วันทำการ ค่าส่ง 50 บาท หรือสั่งครบ 1,500 บาทส่งฟรีค่ะ 📦', time: '14:33' },
  ];

  useEffect(() => {
    if (step < messages.length) {
      timerRef.current = setTimeout(() => setStep(s => s + 1), step === 0 ? 1500 : 2000);
    } else {
      timerRef.current = setTimeout(() => setStep(0), 4000);
    }
    return () => clearTimeout(timerRef.current);
  }, [step, messages.length]);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* LINE header */}
      <div className="bg-[#06C755] px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 flex items-center justify-center">
          <span className="text-white text-[12px] font-bold">OA</span>
        </div>
        <div>
          <p className="text-white text-[14px] font-semibold">ร้านค้าตัวอย่าง</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-dot" />
            <p className="text-white/80 text-[11px]">Tloud AI กำลังตอบ</p>
          </div>
        </div>
      </div>

      {/* Chat body */}
      <div className="bg-[#7494A5] p-4 min-h-[280px] space-y-3">
        {messages.slice(0, step).map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'customer' ? 'justify-end' : 'justify-start'} animate-float-up`}>
            <div className={`max-w-[75%] px-3 py-2 text-[13px] leading-relaxed ${
              msg.from === 'customer'
                ? 'bg-[#A8E063] text-black'
                : 'bg-white text-black'
            }`}>
              {msg.from === 'ai' && (
                <span className="text-[10px] text-brand font-semibold block mb-1">⚡ AI ตอบอัตโนมัติ</span>
              )}
              {msg.text}
              <span className="text-[10px] text-black/40 block text-right mt-1">{msg.time}</span>
            </div>
          </div>
        ))}
        {step > 0 && step < messages.length && step % 2 === 0 && (
          <div className="flex justify-start animate-float-up">
            <div className="bg-white px-4 py-2 text-[13px] text-text-muted">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-text-light rounded-full animate-pulse-dot" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 bg-text-light rounded-full animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 bg-text-light rounded-full animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Animated Counter ───
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let frame = 0;
          const total = 40;
          const step = () => {
            frame++;
            const progress = frame / total;
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(target * eased));
            if (frame < total) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Main Page ───
import { Suspense } from 'react';

function HomeInner() {
  return (
    <main className="min-h-screen">
      {/* ━━━ Nav ━━━ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand flex items-center justify-center">
              <span className="text-white text-[13px] font-bold">T</span>
            </div>
            <span className="text-[18px] font-semibold tracking-tight">Tloud</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-[14px] text-text-muted hover:text-text transition-colors hidden sm:block">ฟีเจอร์</a>
            <a href="#pricing" className="text-[14px] text-text-muted hover:text-text transition-colors hidden sm:block">ราคา</a>
            <a href="#waitlist" className="h-9 px-5 bg-brand text-white text-[13px] font-semibold flex items-center hover:bg-brand-dark transition-colors">
              ลงทะเบียน
            </a>
          </div>
        </div>
      </nav>

      {/* ━━━ Hero ━━━ */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-light text-brand text-[13px] font-medium mb-6 animate-float-up">
                <div className="w-1.5 h-1.5 bg-green rounded-full animate-pulse-dot" />
                Early Access — รับสิทธิ์ใช้ก่อนใคร
              </div>

              <h1 className="text-[36px] sm:text-[44px] leading-[1.15] font-bold tracking-tight animate-float-up animate-float-up-1">
                AI ตอบแชทลูกค้า
                <br />
                <span className="text-brand">24 ชั่วโมง</span>
                <br />
                <span className="text-text-muted font-light text-[28px] sm:text-[34px]">ผ่าน LINE OA ของคุณ</span>
              </h1>

              <p className="text-[16px] sm:text-[17px] text-text-muted leading-relaxed mt-6 max-w-md animate-float-up animate-float-up-2">
                ตั้งค่า 3 คลิก ไม่ต้องเขียนโค้ด AI ตอบคำถามซ้ำๆ อัตโนมัติ
                ตอบได้แม่นเหมือนคุณตอบเอง ลูกค้าไม่หลุด แม้ตี 3
              </p>

              <div className="mt-8 animate-float-up animate-float-up-3">
                <WaitlistForm variant="hero" />
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 mt-8 animate-float-up animate-float-up-4">
                <div className="flex -space-x-2">
                  {['#FFB74D', '#4FC3F7', '#AED581', '#F06292', '#BA68C8'].map((c, i) => (
                    <div key={i} className="w-8 h-8 border-2 border-white rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <p className="text-[13px] text-text-muted">
                  <span className="font-semibold text-text">200+</span> ร้านค้าลงทะเบียนแล้ว
                </p>
              </div>
            </div>

            {/* Right: Chat demo */}
            <div className="animate-float-up animate-float-up-3">
              <ChatDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Pain Points ━━━ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[13px] font-semibold text-brand uppercase tracking-wide mb-2">ปัญหาที่ทุกร้านเจอ</h2>
          <p className="text-[28px] sm:text-[32px] font-bold tracking-tight mb-12">ลูกค้าถามซ้ำๆ ทุกวัน ทุกคืน</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { stat: '85%', label: 'ของข้อความคือคำถามซ้ำๆ', sub: 'ราคา, เปิดกี่โมง, ส่งกี่วัน' },
              { stat: '62%', label: 'เสียลูกค้าช่วงนอกเวลา', sub: 'ตี 2 ลูกค้าถาม — ไม่มีคนตอบ' },
              { stat: '55%', label: 'ขายหลุดเพราะตอบช้า', sub: 'ลูกค้าไม่รอ ไปร้านอื่น' },
              { stat: '15K', label: 'บาท/เดือน จ้างแอดมิน', sub: 'Tloud เริ่มต้นแค่ 499 บาท' },
            ].map((p, i) => (
              <div key={i} className="p-5 bg-white border border-border">
                <div className="text-[36px] font-bold text-text tracking-tight">{p.stat}</div>
                <div className="text-[14px] font-medium text-text mt-1">{p.label}</div>
                <div className="text-[12px] text-text-muted mt-2">{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ How It Works ━━━ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[13px] font-semibold text-brand uppercase tracking-wide mb-2">วิธีใช้งาน</h2>
          <p className="text-[28px] sm:text-[32px] font-bold tracking-tight mb-12">เริ่มใช้ได้ใน 3 นาที</p>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'เชื่อมต่อ LINE OA',
                desc: 'คลิก 3 ครั้ง เชื่อม LINE OA ของคุณ ไม่ต้องตั้งค่าอะไรเพิ่ม',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.69a4.5 4.5 0 00-6.364-6.364L4.5 8.257" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'ใส่ข้อมูลร้าน',
                desc: 'อัพโหลดรูป พิมพ์ข้อมูลสินค้า ราคา เวลาเปิด-ปิด AI เรียนรู้ทันที',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'AI ตอบแทนคุณ',
                desc: 'ลูกค้าถามทาง LINE — AI ตอบทันที 24 ชม. ถ้าซับซ้อนส่งต่อให้คุณเลย',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                ),
              },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="text-[64px] font-bold text-foreground/[0.04] leading-none absolute top-0 right-0">{s.step}</div>
                <div className="w-12 h-12 bg-brand-light text-brand flex items-center justify-center mb-4">{s.icon}</div>
                <h3 className="text-[18px] font-semibold text-text mb-2">{s.title}</h3>
                <p className="text-[14px] text-text-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Features ━━━ */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[13px] font-semibold text-brand uppercase tracking-wide mb-2">ฟีเจอร์</h2>
          <p className="text-[28px] sm:text-[32px] font-bold tracking-tight mb-12">ไม่ใช่แค่แชทบอท — เป็นพนักงานดิจิทัลตัวจริง</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'ตอบ FAQ อัตโนมัติ', desc: 'ราคา, สต๊อก, เวลาเปิด-ปิด, วิธีสั่ง — ตอบได้หมด ตอบถูกทุกครั้ง', tag: 'AI Receptionist' },
              { title: 'ส่งต่อให้คนจริง', desc: 'คำถามยากเกินไป? AI ส่งต่อให้คุณทันที พร้อมแจ้งเตือนผ่าน LINE', tag: 'Human Handoff' },
              { title: 'เปิดร้าน 24 ชม.', desc: 'ตี 2 ลูกค้าถาม — AI ตอบแทน ไม่ต้องเสียลูกค้าเพราะนอนแล้ว', tag: 'After Hours' },
              { title: 'ปรับโทนเสียงได้', desc: 'เลือกสไตล์: สุภาพ น่ารัก หรือจริงจัง ให้ AI ตอบเหมือนคุณตอบเอง', tag: 'Thai Tone' },
              { title: 'อัพเดทสต๊อกผ่าน LINE', desc: 'ส่งข้อความ "หมด X" — AI หยุดขายทันที ไม่ต้องเข้าหลังบ้าน', tag: 'Quick Update' },
              { title: 'แดชบอร์ดดูผล', desc: 'ดูว่า AI ตอบกี่ข้อความ ขายได้เท่าไหร่ ลูกค้าถามอะไรมากสุด', tag: 'Analytics' },
            ].map((f, i) => (
              <div key={i} className="p-5 bg-white border border-border hover:border-brand/30 transition-colors">
                <span className="text-[11px] font-medium text-brand bg-brand-light px-2 py-0.5">{f.tag}</span>
                <h3 className="text-[16px] font-semibold text-text mt-3 mb-2">{f.title}</h3>
                <p className="text-[13px] text-text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Quotes ━━━ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[13px] font-semibold text-brand uppercase tracking-wide mb-2">เสียงจากผู้ใช้จริง</h2>
          <p className="text-[28px] sm:text-[32px] font-bold tracking-tight mb-12">เข้าใจคนขายของออนไลน์</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { text: 'AI ไม่เมา ไม่ลาป่วย ไม่ส่งราคาผิด', who: 'ร้านเครื่องสำอาง — ยอดขาย 300K/เดือน', type: 'ร้านค้าออนไลน์' },
              { text: 'วันก่อนวาเลนไทน์ 200 ข้อความ ร้องไห้เลย', who: 'ร้านเบเกอรี่โฮมเมด', type: 'ร้านอาหาร' },
              { text: 'ฉันทำเล็บอยู่ ตอบ LINE ไม่ได้ ลูกค้าจองที่อื่นแล้ว', who: 'ร้านทำเล็บ — เสียลูกค้าทุกวัน', type: 'ร้านบิวตี้' },
              { text: '499 ไม่แพง เท่ากับข้าวผัด 10 จาน', who: 'ร้านอาหารตามสั่ง', type: 'ร้านอาหาร' },
              { text: 'ช่วงรับสมัคร 3 วัน ผมไม่ได้นอน เพราะตอบ LINE', who: 'สถาบันกวดวิชา', type: 'ติวเตอร์' },
              { text: 'เห็นหน้าตั้งค่าเป็นภาษาอังกฤษ ฉันปิดเลย', who: 'แม่ค้าออนไลน์ — ขายเสื้อผ้า', type: 'ร้านค้าออนไลน์' },
            ].map((q, i) => (
              <div key={i} className="p-5 border border-border bg-white">
                <span className="text-[11px] font-medium text-text-light bg-surface px-2 py-0.5">{q.type}</span>
                <p className="text-[16px] font-medium text-text mt-3 leading-relaxed">&ldquo;{q.text}&rdquo;</p>
                <p className="text-[12px] text-text-muted mt-3">{q.who}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Pricing ━━━ */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[13px] font-semibold text-brand uppercase tracking-wide mb-2">ราคา</h2>
          <p className="text-[28px] sm:text-[32px] font-bold tracking-tight mb-4">ถูกกว่าจ้างแอดมิน 30 เท่า</p>
          <p className="text-[15px] text-text-muted mb-12">จ่ายผ่าน PromptPay ไม่ต้องมีบัตรเครดิต ยกเลิกได้ทุกเมื่อ</p>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                name: 'ฟรี',
                price: '0',
                period: 'ตลอดไป',
                messages: '500 ข้อความ/เดือน',
                features: ['เชื่อมต่อ LINE OA 1 ช่อง', 'ตอบ FAQ อัตโนมัติ', 'แดชบอร์ดพื้นฐาน'],
                cta: 'เริ่มใช้ฟรี',
                popular: false,
              },
              {
                name: 'Starter',
                price: '499',
                period: 'บาท/เดือน',
                messages: '10,000 ข้อความ/เดือน',
                features: ['ทุกอย่างใน ฟรี +', 'ปรับโทนเสียง AI', 'ส่งต่อให้คนจริง', 'อัพเดทสต๊อกผ่าน LINE', 'โหมดนอกเวลาทำการ'],
                cta: 'ลงทะเบียน',
                popular: true,
              },
              {
                name: 'Business',
                price: '1,990',
                period: 'บาท/เดือน',
                messages: '50,000 ข้อความ/เดือน',
                features: ['ทุกอย่างใน Starter +', 'จองคิว / นัดหมาย', 'เก็บเงินผ่าน PromptPay', 'Facebook Messenger', 'รายงานละเอียด'],
                cta: 'ลงทะเบียน',
                popular: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`p-6 bg-white border ${plan.popular ? 'border-brand ring-1 ring-brand' : 'border-border'} relative`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-4 bg-brand text-white text-[11px] font-semibold px-3 py-1">
                    ยอดนิยม
                  </div>
                )}
                <h3 className="text-[16px] font-semibold text-text">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-[40px] font-bold text-text tracking-tight">{plan.price}</span>
                  <span className="text-[14px] text-text-muted">{plan.period}</span>
                </div>
                <p className="text-[13px] text-brand font-medium mt-2">{plan.messages}</p>

                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-[13px] text-text-muted">
                      <svg className="w-4 h-4 text-green mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="square" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#waitlist"
                  className={`block text-center mt-6 h-11 leading-[44px] text-[14px] font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-brand text-white hover:bg-brand-dark'
                      : 'border border-border text-text hover:border-brand hover:text-brand'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-[13px] text-text-light mt-6">
            ต้องการแพลนสำหรับหลายสาขา? <a href="#waitlist" className="text-brand underline">ติดต่อเรา</a>
          </p>
        </div>
      </section>

      {/* ━━━ Stats Bar ━━━ */}
      <section className="py-12 px-4 sm:px-6 border-y border-border bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: 56, suffix: 'M', label: 'คนไทยใช้ LINE' },
            { value: 85, suffix: '%', label: 'คำถามที่ AI ตอบได้' },
            { value: 499, suffix: '', label: 'บาท/เดือน เริ่มต้น' },
            { value: 3, suffix: '', label: 'นาที ตั้งค่าเสร็จ' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-[36px] sm:text-[42px] font-bold text-text tracking-tight">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[13px] text-text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ Bottom CTA ━━━ */}
      <section id="waitlist" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-[28px] sm:text-[32px] font-bold tracking-tight mb-4">
            พร้อมให้ AI ช่วยตอบแชท?
          </h2>
          <p className="text-[15px] text-text-muted mb-8">
            ลงทะเบียนวันนี้ รับสิทธิ์ใช้ก่อนใคร + ฟรี 500 ข้อความ/เดือน ตลอดไป
          </p>
          <WaitlistForm variant="bottom" />
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand flex items-center justify-center">
              <span className="text-white text-[11px] font-bold">T</span>
            </div>
            <span className="text-[14px] font-semibold">Tloud</span>
            <span className="text-[12px] text-text-light ml-2">AI สำหรับธุรกิจไทย</span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-text-light">
            <span>© 2026 Tloud</span>
            <span>·</span>
            <a href="#" className="hover:text-text transition-colors">นโยบายความเป็นส่วนตัว</a>
            <span>·</span>
            <a href="#" className="hover:text-text transition-colors">เงื่อนไขการใช้งาน</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}
