
// Test script to send SMS using your Tinder auth API
const sendSMS = async () => {
  try {
    console.log('Sending SMS request...');
    const response = await fetch('http://localhost:5000/api/auth/phone/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '+66624148053'  // Your phone number
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Response was:', responseText);
      return;
    }

    console.log('Parsed SMS Response:', result);
    
    if (result.success && result.data?.sms_sent) {
      console.log('✅ SMS sent successfully!');
      console.log('Check your phone for the verification code');
    } else {
      console.log('❌ Failed to send SMS:', result.error);
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

sendSMS();
