# Naija Nutri Track

A total health tracking app built for Nigerians, so people can monitor nutrition, activity and overall wellbeing while eating the local foods they already know.

Most popular nutrition apps are built around Western food databases. Dishes like jollof rice, egusi, amala or moi moi are either missing or logged with guessed values, which makes the numbers unreliable for someone eating a typical Nigerian diet. Naija Nutri Track starts from local food and verified local data instead.

This was my undergraduate capstone project in Computer Science at Pan-Atlantic University (2024).

## What it does

* **Local food database built on verified data.** Food entries combine nutritional values with health information from NAFDAC, Nigeria's food and drug regulator, so users can understand what is in their meals and compare healthier alternatives from a trusted source.
* **Log a meal from a photo.** Users take or upload a picture of their food. A trained image classification model identifies the dish, the app looks it up in the food database and logs it with its nutritional values automatically.
* **Wearable activity data.** The app connects to Fitbit to pull profile and calorie burn data, so diet and activity sit side by side in one profile.
* **Daily summary and recommendations.** Users see their intake against their goals and get meal recommendations.
* **Custom meals.** Users can create their own meals when a dish is not yet in the database.

## How it works

```
Photo of meal
     │
     ▼
Image classification service (/predict)  ──►  predicted dish name
     │
     ▼
Firestore food database (foodDetails, customMeals)
     │
     ▼
Meal logged with nutritional values  ──►  daily summary and recommendations
     ▲
     │
Fitbit Web API (profile, calories burned)
```

The mobile app is built with React Native and Expo. The food recognition model runs as a separately hosted Python service that exposes a `/predict` endpoint, which the app calls with the user's photo. Firebase handles authentication and stores the food database and user logs.

## Tech stack

* **Mobile app:** React Native, Expo, React Navigation, React Native Paper
* **Machine learning:** Python, TensorFlow, image classification model trained on Nigerian dishes, served behind a `/predict` API
* **Backend and data:** Firebase Authentication, Cloud Firestore
* **Integrations:** Fitbit Web API
* **Other:** Axios, Formik and Yup for form validation, date fns

## Roadmap

* Apple Health and Garmin Connect integrations, so users on any major wearable get the same combined view
* Expand the food image dataset to cover more regional dishes and portion sizes
* Show model confidence and let users correct a wrong prediction, feeding those corrections back into training

## Project structure

```
NaijaNutriTrack/
├── src/
│   ├── components/   Reusable UI components
│   ├── db/           Firebase configuration
│   ├── hooks/        Fitbit data hooks
│   └── screens/      App screens (food log, food detector, summary, wearable)
├── assets/
├── App.js
└── app.json
```

## Running locally

1. Clone the repository

```
git clone https://github.com/nwaniayo/NaijaNutriTrack.git
cd NaijaNutriTrack
npm install
```

2. Create a Firebase project with Authentication and Firestore enabled, then add your config in `src/db/firestore.js`.

3. To use the Fitbit features, add a Fitbit API access token to a `.env` file:

```
ACCESS_TOKEN=your_fitbit_token
```

4. Start the app

```
npm start
```

## License

MIT
