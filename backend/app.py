import smtplib 
from flask import Flask, request, jsonify
from flask_cors import CORS
from email.message import EmailMessage
from email_validator import validate_email, EmailNotValidError
from config import SMTP_SERVER, SMTP_PORT, EMAIL_ADDRESS, EMAIL_PASSWORD, RECIPIENT_EMAIL

app = Flask(__name__)
CORS(app)

@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.json
    message = data.get('message')

    if not message:
        return jsonify({"error": "Message content is required"}), 400

    try:
        recipient_email = RECIPIENT_EMAIL
        validate_email(recipient_email)
        email = EmailMessage()
        email.set_content(message)
        email['Subject'] = "Message to Wellfound Thread from Application"
        email['From'] = EMAIL_ADDRESS
        email['To'] = recipient_email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(email)

        return jsonify({"message": "Email sent successfully"}), 200

    except EmailNotValidError as e:
        return jsonify({"error": e}), 400
    except Exception as e:
        return jsonify({"error": e}), 500

if __name__ == '__main__':
    app.run(debug=True)
