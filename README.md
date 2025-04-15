## 🌲 Django Real-time Chat Website

### 💼  General Purpose

In this exciting project, we build a dynamic chat website by leveraging Django Channels to enable real-time communication. Users can engage in live conversations with agents on the backend, providing an interactive and responsive platform.

**It's just for a personal or learning project**


## 📸 Screenshots / Demo

![Screenshot 1](https://i.imgur.com/RLHtJVc.png)
![Screenshot 2](https://i.imgur.com/QjWHjFq.png)
![Screenshot 3](https://i.imgur.com/XBzBBdQ.png)
![Screenshot 4](https://i.imgur.com/z8mtNKH.png) ![Screenshot 5](https://i.imgur.com/JGlE0YF.png)
![Screenshot 6](https://i.imgur.com/RvgHEtt.png)



### 🎥 Project Walkthrough

Click the image below to watch a video walkthrough of the project:
Watch the demo: 

[![Watch the demo](https://img.youtube.com/vi/OiUY6K5XySA/0.jpg)](https://youtu.be/OiUY6K5XySA)



## 🛠️ Tech Stack

- Backend: Django, Django Channels
- Frontend: Tailwind CSS, flowbite, JavaScript
- Database: SQLite
- Authentication: Django authentication system


## 🙏 Credits

- This project was created and inspired by the YouTube tutorial from **Code With Stein**.
Watch the full tutorial here: YouTube Link. 

https://youtu.be/9e7CTR2Ya4Y?feature=shared

Special thanks to the creator for the detailed step-by-step guide on building this chat website using Django Channels and real-time communication techniques.

- Hero section: https://tailwindflex.com/@amine-ghanim/hero-section-22
- Icon: https://heroicons.com/




## 📦 Installation

Follow these steps to get the project running on your local machine:

1. Clone the repository
2. Create and active a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Install Node.js Dependencies for Tailwind

```bash
npm install
```

Start Tailwind in watch mode:

```bash
npx tailwindcss -i ./static/css/main.css -o ./static/css/main.min.css --watch
```

5. Configure the Database

```bash
python manage.py migrate
```

(Optional: Create superuser)

```bash
python manage.py createsuperuser
```

6. Run the Development Server

```bash
python manage.py runserver
```

Visit http://127.0.0.1:8000/ to view the chat website in action!


## 🤝 Contributing
Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch (git checkout -b feature/YourFeature)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin feature/YourFeature)
5. Open a pull request


## 🙋‍♂️ Contact
GitHub: @ouyniya