import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gvwmtyyexfidixmvlwwm.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_qPVMDWwS4qeWrTXsVVPXWQ_snHlZW1v'

export const supabase = createClient(supabaseUrl, supabaseKey)