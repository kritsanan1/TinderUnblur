
// Test script to send SMS using your Tinder auth API
const sendSMS = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/phone/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '+66624148053'  // Your phone number
      })
    });

    const result = await response.json();
    console.log('SMS Response:', result);
    
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
