# Quick Setup Checklist - External Connections

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### 2. Set Up Environment
```bash
cp env.example .env
# Edit .env with your settings
```

### 3. Set Up Database
```bash
npm run setup-db
```

### 4. Test All Connections
```bash
npm run test-connections
```

### 5. Start the Application
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend  
cd client && npm start
```

## 🔗 External Connections Summary

| Connection | Status | Configuration |
|------------|--------|---------------|
| **Frontend ↔ Backend** | ✅ Auto-configured | Proxy in `client/package.json` |
| **Backend ↔ Database** | ⚙️ Needs setup | MySQL credentials in `.env` |
| **Backend ↔ OpenAI** | ⚙️ Optional | API key in `.env` |
| **Backend ↔ Email** | ⚙️ Optional | SMTP credentials in `.env` |
| **Local ↔ Internet** | ⚙️ For deployment | Hosting platform config |

## ⚙️ Required Configuration

### Database (Required)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=examination_system
```

### JWT Secret (Required)
```env
JWT_SECRET=your_super_secret_jwt_key_here
```

## 🎯 Optional Configuration

### OpenAI API (For AI features)
```env
OPENAI_API_KEY=sk-your-openai-api-key
```

### Email Service (For notifications)
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

## 🧪 Testing Commands

```bash
# Test all connections
npm run test-connections

# Test database only
npm run setup-db

# Test API server
curl http://localhost:5000/api/health
```

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Database connection failed | Check MySQL is running and credentials in `.env` |
| API server not responding | Run `npm start` in root directory |
| Frontend not loading | Run `cd client && npm start` |
| OpenAI API errors | Get valid API key from [OpenAI Platform](https://platform.openai.com/) |
| Email not working | Configure Gmail app password |

## 📚 Next Steps

1. **Complete Setup:** Follow the checklist above
2. **Test Everything:** Run `npm run test-connections`
3. **Start Development:** Begin building your features
4. **Deploy:** When ready, follow deployment guide in `SETUP.md`

## 🆘 Need Help?

- **Detailed Setup:** See `SETUP.md`
- **External Connections:** See `EXTERNAL_CONNECTIONS.md`
- **Project Overview:** See `README.md`
- **Demo Accounts:** Check `SETUP.md` for login credentials

---

**🎉 You're all set!** Once you complete this checklist, your Online Examination System will be fully functional with all external connections working properly. 