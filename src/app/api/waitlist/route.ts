import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lineId, business, utm_source, utm_medium, utm_campaign } = body;

    if (!lineId || typeof lineId !== 'string' || lineId.trim().length < 2) {
      return NextResponse.json({ error: 'LINE ID required' }, { status: 400 });
    }

    const supabase = getSupabase();

    if (supabase) {
      const { error } = await supabase.from('waitlist').insert({
        line_id: lineId.trim(),
        business_type: business?.trim() || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
      });

      if (error) {
        console.error('Supabase insert error:', error);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
      }
    } else {
      // Dev fallback: log to console
      console.log('[waitlist]', {
        lineId: lineId.trim(),
        business: business?.trim(),
        utm_source, utm_medium, utm_campaign,
        time: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json({ count: 0, message: 'Supabase not configured — dev mode' });
  }

  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });

  return NextResponse.json({ count: count ?? 0 });
}
