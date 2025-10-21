-- supabase-schema.sql
-- Sora Prompt Generator Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    whop_user_id TEXT UNIQUE NOT NULL,
    email TEXT,
    username TEXT,
    subscription_tier TEXT NOT NULL DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'pro', 'max')),
    credits_remaining INTEGER NOT NULL DEFAULT 0,
    total_credits_purchased INTEGER NOT NULL DEFAULT 0,
    google_drive_connected BOOLEAN NOT NULL DEFAULT false,
    google_drive_folder_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prompt_text TEXT NOT NULL,
    prompt_json JSONB NOT NULL,
    sora_model TEXT NOT NULL CHECK (sora_model IN ('sora-2', 'sora-2-pro')),
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds IN (4, 8, 12)),
    resolution TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    job_id TEXT, -- Changed from openai_job_id to job_id
    video_url TEXT,
    gdrive_file_id TEXT,
    error_message TEXT,
    credits_used INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    json_structure JSONB NOT NULL,
    preview_image_url TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_whop_user_id ON users(whop_user_id);
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON templates(is_public);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default templates
INSERT INTO templates (name, description, category, json_structure, is_public) VALUES
(
    'Cinematic Scene',
    'Professional cinematic video with dramatic camera movement',
    'Cinematic',
    '{
        "scene": {
            "subject": "{{SUBJECT}}",
            "environment": "{{ENVIRONMENT}}",
            "composition": "wide shot, rule of thirds"
        },
        "camera": {
            "angle": "eye level",
            "movement": "slow dolly forward",
            "lens": "35mm equivalent, shallow depth of field",
            "focus": "subject sharp, background soft bokeh"
        },
        "motion": {
            "primary": "{{PRIMARY_ACTION}}",
            "pace": "slow, dramatic"
        },
        "lighting": {
            "source": "natural window light",
            "direction": "45 degrees camera left",
            "quality": "soft directional",
            "color_temp": "warm 3200K",
            "mood": "cinematic, moody"
        },
        "timeline": {
            "0-3s": "establish scene",
            "3-8s": "focus on subject action",
            "8-12s": "reveal final moment"
        }
    }'::jsonb,
    true
),
(
    'Product Demo',
    'Clean product showcase with professional lighting',
    'Commercial',
    '{
        "scene": {
            "subject": "{{PRODUCT_NAME}}",
            "environment": "minimal white studio backdrop",
            "objects": ["product on pedestal"],
            "composition": "centered, medium shot"
        },
        "camera": {
            "angle": "slightly elevated, 15 degrees",
            "movement": "slow rotation around product",
            "lens": "50mm equivalent, f/2.8",
            "focus": "product sharp throughout"
        },
        "motion": {
            "primary": "camera orbits 180 degrees",
            "secondary": "{{PRODUCT_FEATURE}} highlighted",
            "pace": "smooth, professional"
        },
        "lighting": {
            "source": "three-point studio lighting",
            "direction": "key light from front-left, fill from right, rim from back",
            "quality": "soft, even illumination",
            "color_temp": "neutral 5600K",
            "mood": "clean, professional"
        }
    }'::jsonb,
    true
),
(
    'Tutorial/Educational',
    'Clear instructional video with step-by-step focus',
    'Educational',
    '{
        "scene": {
            "subject": "{{INSTRUCTOR_OR_OBJECT}}",
            "environment": "{{WORKSPACE_SETTING}}",
            "composition": "medium close-up"
        },
        "camera": {
            "angle": "eye level, straight on",
            "movement": "static with occasional push-in for emphasis",
            "lens": "35mm equivalent",
            "focus": "subject always in focus"
        },
        "motion": {
            "primary": "{{DEMONSTRATION_ACTION}}",
            "secondary": "hands performing steps clearly visible",
            "pace": "measured, easy to follow"
        },
        "lighting": {
            "source": "bright overhead and side lighting",
            "quality": "even, clear",
            "color_temp": "daylight 5000K",
            "mood": "bright, inviting, clear"
        },
        "timeline": {
            "0-2s": "introduce subject",
            "2-8s": "demonstrate key steps",
            "8-12s": "show final result"
        }
    }'::jsonb,
    true
);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (true);

-- Videos policies
CREATE POLICY "Users can view own videos" ON videos
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own videos" ON videos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own videos" ON videos
    FOR UPDATE USING (true);

-- Templates policies
CREATE POLICY "Anyone can view public templates" ON templates
    FOR SELECT USING (is_public = true);

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON videos TO authenticated;
GRANT ALL ON templates TO authenticated;

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;