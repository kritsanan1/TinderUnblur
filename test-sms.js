
// Test script to send SMS using your Tinder auth API
const sendSMS = async () => {
  try {
    console.log('🔄 Sending SMS request...');
    console.log('📱 Phone number: +66624148053');
    
    const response = await fetch('http://localhost:5000/api/auth/phone/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '+66624148053'  // Your phone number
      })
    });

    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📄 Raw response:', responseText);

    if (!responseText) {
      console.error('❌ Empty response received');
      return;
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError.message);
      console.error('📄 Response was:', responseText);
      return;
    }

    console.log('✅ Parsed SMS Response:', result);
    
    if (result.success && result.data?.sms_sent) {
      console.log('✅ SMS sent successfully!');
      console.log('📱 Check your phone for the verification code');
    } else {
      console.log('❌ Failed to send SMS:', result.error);
      console.log('💡 This might be due to:');
      console.log('   - Missing required headers in Tinder API request');
      console.log('   - Phone number format issues');
      console.log('   - Tinder API rate limiting');
      console.log('   - Geographic restrictions');
    }
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    console.error('🔍 Stack trace:', error.stack);
  }
};

// Test with different approaches
const testMultipleApproaches = async () => {
  console.log('🧪 Testing multiple approaches...\n');
  
  // Test 1: Original phone number format
  console.log('🧪 Test 1: With + prefix');
  await sendSMS();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Alternative endpoint test
  console.log('🧪 Test 2: Testing server health');
  try {
    const healthResponse = await fetch('http://localhost:5000/api/analytics/demo-user-id');
    console.log('🏥 Server health status:', healthResponse.status);
    console.log('🏥 Server health response:', await healthResponse.text());
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
  }
};

testMultipleApproaches();
