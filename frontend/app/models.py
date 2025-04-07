from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # customer, merchant, courier

    # Relationships
    customer_transactions = db.relationship('Transaction', foreign_keys='Transaction.customer_id', backref='customer', lazy=True)
    merchant_transactions = db.relationship('Transaction', foreign_keys='Transaction.merchant_id', backref='merchant', lazy=True)
    courier_transactions = db.relationship('Transaction', foreign_keys='Transaction.courier_id', backref='courier', lazy=True)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference_number = db.Column(db.String(10), unique=True, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    merchant_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    courier_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, completed

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # User posting the review
    reviewee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # User being reviewed (merchant or courier)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transaction.id'), nullable=False)  # Transaction being reviewed
    rating = db.Column(db.Integer, nullable=False)  # Rating (1-5 stars)
    comment = db.Column(db.Text, nullable=True)  # Optional comment
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())  # Timestamp of the review

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # User associated with the payment info
    payment_method = db.Column(db.String(50), nullable=False)  # e.g., Bank, Mobile Money
    details = db.Column(db.String(200), nullable=False)  # e.g., Account number, Mobile money number