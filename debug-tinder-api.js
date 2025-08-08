
// Direct Tinder API test to understand the issue
const testTinderAPI = async () => {
  const phoneNumber = '66624148053'; // Without + prefix as per API docs
  
  const headers = {
    'User-Agent': 'Tinder/11.4.0 (iPhone; iOS 12.4.1; Scale/2.00)',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'app-session-id': 'generated-session-id',
    'app-session-time-elapsed': '0',
    'app-version': '11.4.0',
    'tinder-version': '11.4.0',
    'platform': 'ios'
  };

  const payload = {
    phone_number: phoneNumber
  };

  console.log('🔍 Testing Tinder API directly...');
  console.log('📡 URL: https://api.gotinder.com/v2/auth/sms/send?auth_type=sms');
  console.log('📱 Phone number:', phoneNumber);
  console.log('📋 Headers:', headers);
  console.log('📦 Payload:', payload);

  try {
    const response = await fetch('https://api.gotinder.com/v2/auth/sms/send?auth_type=sms', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📄 Raw Response:', responseText);

    if (responseText) {
      try {
        const jsonData = JSON.parse(responseText);
        console.log('✅ Parsed JSON:', jsonData);
      } catch (parseError) {
        console.log('❌ JSON Parse Error:', parseError.message);
      }
    } else {
      console.log('❌ Empty response body');
    }

  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.error('🔍 Stack:', error.stack);
  }
};

testTinderAPI();
