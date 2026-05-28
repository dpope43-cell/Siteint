import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createAdminClient()
  
  const { data: competitors, error } = await supabase
    .from('competitors')
    .select('*')
    .order('name')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ competitors })
}

export async function POST(request: Request) {
  const supabase = createAdminClient()
  
  try {
    const body = await request.json()
    const { name, color } = body
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    
    const { data: competitor, error } = await supabase
      .from('competitors')
      .insert({ name, color: color || '#6b7280' })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ competitor })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
