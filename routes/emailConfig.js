import express from 'express';
import sendEmail from '../util/mailer.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
	if (!req.body.recipient_email) {
		return res.status(400)
		.json(
			{ 
				message: 'Missing recipient_email.' 
			}
		);
	}

	try {
		await sendEmail(req.body);
		res.status(200).json({ message: 'Subscription email sent.' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post('/send_email', async (req, res) => {
	try {
		await sendEmail(req.body);
		res.json({ message: 'Email sent successfully.' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post('/send_newsletter', async (req, res) => {
	const { subject, message, recipient_email } = req.body;

	if (!Array.isArray(recipient_email) || recipient_email.length === 0) {
		return res.status(400).json({ message: 'Invalid or missing recipient_email array.' });
	}

	try {
		await sendEmail({ subject, message, recipient_email: recipient_email.join(',') });
		res.json({ message: 'Newsletter sent.' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;
