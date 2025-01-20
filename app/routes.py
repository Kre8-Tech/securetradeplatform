from .models import User, Transaction, Review, Payment  # Add Payment to the import
from .models import User, Transaction, Review  # Add Review to the import

from flask import Blueprint, jsonify, request
from .models import User, Transaction
from . import db
import time  # Import the time module

# Create a Blueprint for routes
bp = Blueprint('routes', __name__)

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        print("Received data:", data)  # Log the received data

        # Check if the email already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"message": "Email already registered"}), 400

        # Create a new user
        new_user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error registering user"}), 500

@bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    print("Users in database:", users)  # Log the users
    return jsonify([{"id": user.id, "email": user.email, "role": user.role} for user in users]), 200

@bp.route('/test', methods=['GET'])
def test():
    try:
        # Generate a unique email using a timestamp
        unique_email = f"test{int(time.time())}@example.com"

        # Create a sample user
        new_user = User(
            email=unique_email,  # Use the unique email
            first_name='John',
            last_name='Doe',
            role='customer'
        )
        db.session.add(new_user)
        db.session.commit()

        # Create a sample transaction
        new_transaction = Transaction(
            reference_number='AB1234',
            customer_id=new_user.id,
            merchant_id=new_user.id,
            status='pending'
        )
        db.session.add(new_transaction)
        db.session.commit()

        return jsonify({"message": "Test data created successfully!"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@bp.route('/register-transaction', methods=['POST'])
def register_transaction():
    try:
        data = request.json
        print("Received transaction data:", data)  # Log the received data

        # Generate a unique reference number (e.g., first letters of names + random numbers)
        customer = User.query.get(data['customer_id'])
        merchant = User.query.get(data['merchant_id'])
        reference_number = f"{customer.first_name[0]}{merchant.first_name[0]}{int(time.time()) % 10000}"

        # Create a new transaction
        new_transaction = Transaction(
            reference_number=reference_number,
            customer_id=data['customer_id'],
            merchant_id=data['merchant_id'],
            courier_id=data.get('courier_id'),  # Optional field
            status='pending'
        )
        db.session.add(new_transaction)
        db.session.commit()
        return jsonify({"message": "Transaction registered successfully!", "reference_number": reference_number}), 201
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error registering transaction"}), 500

@bp.route('/complete-transaction/<int:transaction_id>', methods=['PUT'])
def complete_transaction(transaction_id):
    try:
        # Find the transaction by ID
        transaction = Transaction.query.get(transaction_id)
        if not transaction:
            return jsonify({"message": "Transaction not found"}), 404

        # Update the transaction status to 'completed'
        transaction.status = 'completed'
        db.session.commit()
        return jsonify({"message": "Transaction marked as complete"}), 200
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error updating transaction"}), 500

@bp.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([{
        "id": transaction.id,
        "reference_number": transaction.reference_number,
        "customer_id": transaction.customer_id,
        "merchant_id": transaction.merchant_id,
        "courier_id": transaction.courier_id,
        "status": transaction.status
    } for transaction in transactions]), 200

@bp.route('/post-review', methods=['POST'])
def post_review():
    try:
        data = request.json
        print("Received review data:", data)  # Log the received data

        # Create a new review
        new_review = Review(
            reviewer_id=data['reviewer_id'],
            reviewee_id=data['reviewee_id'],
            transaction_id=data['transaction_id'],
            rating=data['rating'],
            comment=data.get('comment')  # Optional field
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify({"message": "Review posted successfully!"}), 201
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error posting review"}), 500

@bp.route('/reviews/<int:user_id>', methods=['GET'])
def get_reviews(user_id):
    try:
        # Fetch reviews for the specified user (reviewee)
        reviews = Review.query.filter_by(reviewee_id=user_id).all()
        return jsonify([{
            "id": review.id,
            "reviewer_id": review.reviewer_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at
        } for review in reviews]), 200
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error fetching reviews"}), 500

@bp.route('/save-payment', methods=['POST'])
def save_payment():
    try:
        data = request.json
        print("Received payment data:", data)  # Log the received data

        # Create a new payment record
        new_payment = Payment(
            user_id=data['user_id'],
            payment_method=data['payment_method'],
            details=data['details']
        )
        db.session.add(new_payment)
        db.session.commit()
        return jsonify({"message": "Payment information saved successfully!"}), 201
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error saving payment information"}), 500

@bp.route('/payments/<int:user_id>', methods=['GET'])
def get_payments(user_id):
    try:
        # Fetch payment information for the specified user
        payments = Payment.query.filter_by(user_id=user_id).all()
        return jsonify([{
            "id": payment.id,
            "payment_method": payment.payment_method,
            "details": payment.details
        } for payment in payments]), 200
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error fetching payment information"}), 500

@bp.route('/admin/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        return jsonify([{
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role
        } for user in users]), 200
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error fetching users"}), 500

@bp.route('/admin/transactions', methods=['GET'])
def get_all_transactions():
    try:
        transactions = Transaction.query.all()
        return jsonify([{
            "id": transaction.id,
            "reference_number": transaction.reference_number,
            "customer_id": transaction.customer_id,
            "merchant_id": transaction.merchant_id,
            "courier_id": transaction.courier_id,
            "status": transaction.status
        } for transaction in transactions]), 200
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error fetching transactions"}), 500

@bp.route('/admin/reviews', methods=['GET'])
def get_all_reviews():
    try:
        reviews = Review.query.all()
        return jsonify([{
            "id": review.id,
            "reviewer_id": review.reviewer_id,
            "reviewee_id": review.reviewee_id,
            "transaction_id": review.transaction_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at
        } for review in reviews]), 200
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error fetching reviews"}), 500

@bp.route('/admin/delete-user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error deleting user"}), 500

@bp.route('/admin/delete-review/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({"message": "Review not found"}), 404
        db.session.delete(review)
        db.session.commit()
        return jsonify({"message": "Review deleted successfully"}), 200
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error deleting review"}), 500

@bp.route('/transaction-stats', methods=['GET'])
def get_transaction_stats():
    try:
        # Fetch total transactions
        total_transactions = Transaction.query.count()

        # Fetch completed transactions
        completed_transactions = Transaction.query.filter_by(status='completed').count()

        # Fetch pending transactions
        pending_transactions = Transaction.query.filter_by(status='pending').count()

        return jsonify({
            "total_transactions": total_transactions,
            "completed_transactions": completed_transactions,
            "pending_transactions": pending_transactions
        }), 200
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"message": "Error fetching transaction statistics"}), 500