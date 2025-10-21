/**
 * Test script to verify Sora 2 API access
 * Run with: node test-sora-api.js
 */

require('dotenv').config({ path: '.env.local' });

async function testSoraAPI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found in .env.local');
    return;
  }

  console.log('🔑 API Key found (first 20 chars):', apiKey.substring(0, 20) + '...');
  console.log('\n📋 Testing OpenAI API access...\n');

  // Test 1: Check if API key is valid
  console.log('Test 1: Validating API key...');
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API key is valid');
      console.log(`   Found ${data.data.length} models available`);

      // Check if sora models are listed
      const soraModels = data.data.filter(m => m.id.includes('sora'));
      if (soraModels.length > 0) {
        console.log('✅ Sora models found:', soraModels.map(m => m.id).join(', '));
      } else {
        console.log('⚠️  No Sora models found in available models list');
        console.log('   This might be normal - Sora 2 API might not appear in /models endpoint');
      }
    } else {
      const error = await response.json();
      console.error('❌ API key validation failed:', error);
      return;
    }
  } catch (error) {
    console.error('❌ Error testing API key:', error.message);
    return;
  }

  // Test 2: Check organization
  console.log('\nTest 2: Checking organization...');
  try {
    const response = await fetch('https://api.openai.com/v1/organization', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Organization data:', data);
    } else {
      console.log('⚠️  Could not fetch organization data (endpoint might not exist)');
    }
  } catch (error) {
    console.log('⚠️  Organization check skipped:', error.message);
  }

  // Test 3: Try to access Sora 2 directly
  console.log('\nTest 3: Testing Sora 2 API access...');
  try {
    const response = await fetch('https://api.openai.com/v1/videos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sora-2',
        prompt: 'A test video',
        size: '1280x720',
        seconds: '4',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Sora 2 API access confirmed!');
      console.log('   Job ID:', data.id);
      console.log('\n🎉 Your API is working! You can disable mock mode.');
    } else {
      console.error('❌ Sora 2 API error:', data);

      if (data.error?.message?.includes('verify')) {
        console.log('\n📝 Action needed:');
        console.log('   1. Go to: https://platform.openai.com/settings/organization/general');
        console.log('   2. Click "Verify Organization"');
        console.log('   3. Wait up to 15 minutes for access to propagate');
        console.log('   4. Use mock mode in the meantime (NEXT_PUBLIC_MOCK_MODE="true")');
      } else if (data.error?.message?.includes('model')) {
        console.log('\n📝 Possible issues:');
        console.log('   • You might not have Sora 2 API access yet');
        console.log('   • Try using the web interface first: https://chatgpt.com');
        console.log('   • Check if you need to join a waitlist');
      }
    }
  } catch (error) {
    console.error('❌ Error testing Sora 2:', error.message);
  }

  // Test 4: Try Azure OpenAI endpoint (alternative)
  console.log('\nTest 4: Checking for alternative endpoints...');
  console.log('   If direct API doesn\'t work, you can use:');
  console.log('   • Azure OpenAI Service (if you have access)');
  console.log('   • Replicate.com (has Sora 2 API)');
  console.log('   • Keep using mock mode for development');
}

testSoraAPI();
