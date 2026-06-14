export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: { id: string; key: string; value: string | null; updated_at: string }
        Insert: { key: string; value?: string | null }
        Update: { key?: string; value?: string | null }
      }
      categories: {
        Row: {
          id: string; name: string; slug: string; description: string | null
          image_url: string | null; sort_order: number; is_active: boolean; created_at: string
        }
        Insert: { name: string; slug: string; description?: string | null; image_url?: string | null; sort_order?: number; is_active?: boolean }
        Update: { name?: string; slug?: string; description?: string | null; image_url?: string | null; sort_order?: number; is_active?: boolean }
      }
      products: {
        Row: {
          id: string; category_id: string | null; name: string; description: string | null
          images: string[]; is_featured: boolean; is_active: boolean; sort_order: number; created_at: string
        }
        Insert: { category_id?: string | null; name: string; description?: string | null; images?: string[]; is_featured?: boolean; is_active?: boolean; sort_order?: number }
        Update: { category_id?: string | null; name?: string; description?: string | null; images?: string[]; is_featured?: boolean; is_active?: boolean; sort_order?: number }
      }
      clients: {
        Row: { id: string; name: string; logo_url: string | null; website_url: string | null; sort_order: number; is_active: boolean; created_at: string }
        Insert: { name: string; logo_url?: string | null; website_url?: string | null; sort_order?: number; is_active?: boolean }
        Update: { name?: string; logo_url?: string | null; website_url?: string | null; sort_order?: number; is_active?: boolean }
      }
      testimonials: {
        Row: { id: string; author_name: string; author_role: string | null; company: string | null; content: string; rating: number; avatar_url: string | null; is_active: boolean; sort_order: number; created_at: string }
        Insert: { author_name: string; author_role?: string | null; company?: string | null; content: string; rating?: number; avatar_url?: string | null; is_active?: boolean; sort_order?: number }
        Update: { author_name?: string; author_role?: string | null; company?: string | null; content?: string; rating?: number; avatar_url?: string | null; is_active?: boolean; sort_order?: number }
      }
      contact_messages: {
        Row: { id: string; type: string; name: string; email: string; phone: string | null; company: string | null; message: string; category: string | null; quantity: string | null; is_read: boolean; created_at: string }
        Insert: { type?: string; name: string; email: string; phone?: string | null; company?: string | null; message: string; category?: string | null; quantity?: string | null }
        Update: { is_read?: boolean }
      }
      team_members: {
        Row: { id: string; name: string; role: string; bio: string | null; photo_url: string | null; email: string | null; whatsapp: string | null; linkedin_url: string | null; sort_order: number; is_active: boolean; created_at: string }
        Insert: { name: string; role: string; bio?: string | null; photo_url?: string | null; email?: string | null; whatsapp?: string | null; linkedin_url?: string | null; sort_order?: number; is_active?: boolean }
        Update: { name?: string; role?: string; bio?: string | null; photo_url?: string | null; email?: string | null; whatsapp?: string | null; linkedin_url?: string | null; sort_order?: number; is_active?: boolean }
      }
      gallery_images: {
        Row: { id: string; url: string; alt_text: string | null; section: string; sort_order: number; is_active: boolean; created_at: string }
        Insert: { url: string; alt_text?: string | null; section?: string; sort_order?: number; is_active?: boolean }
        Update: { url?: string; alt_text?: string | null; section?: string; sort_order?: number; is_active?: boolean }
      }
    }
  }
}

// Convenience types
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type ContactMessage = Database['public']['Tables']['contact_messages']['Row']
export type GalleryImage = Database['public']['Tables']['gallery_images']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']
export type TeamMember = Database['public']['Tables']['team_members']['Row']
