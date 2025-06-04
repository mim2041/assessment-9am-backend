# MERN Auth with Dynamic Shop Subdomains

This is a full-stack MERN (MongoDB, Express, React, Node.js) authentication project that supports:

- Secure user signup/login
- Shop registration with unique global names
- Dynamic subdomain routing (e.g., `beautyhub.localhost:5173`)
- Persistent authentication across subdomains
- “Remember Me” session handling
- Token validation with auto redirection and loading state

---

## 📁 Project Structure


---

## 🚀 Github Repositoyr

🌐 **Frontend**: [https://github.com/mim2041/assessment-9am](#)  
🔗 **Backend**: [https://github.com/mim2041/assessment-9am-backend](#)  

---

## 🧪 Features

### ✅ Authentication

- JWT-based auth with secure cookies
- “Remember Me” (7-day session) or default (30 mins)
- Password rules: 8+ characters, 1 number, 1 special character

### 🏬 Shop Management

- Each user adds **3+ shop names**
- Shop names are **globally unique**
- Clicking a shop redirects to its subdomain (e.g., `grocery.localhost:5173`)
- Subdomain access is protected with token validation

### ⚙️ Dashboard

- Show user’s shops
- Profile icon with logout & confirmation
- Loading spinner on token validation in subdomain pages

---

## 📦 Setup Instructions

1. **Clone the repo**
```bash
git clone https://github.com/mim2041/assessment-9am
cd assessment-9am
```
