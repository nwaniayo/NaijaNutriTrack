# NaijaNutriTrack

NaijaNutriTrack is a mobile application built with React Native and Expo, designed to help users track their food intake, monitor their nutritional values, and manage their dietary goals. The app integrates with Firebase for authentication and data storage, and it utilizes various libraries for enhanced functionality.

## Features

- User authentication (sign up, login, logout)
- Food logging with nutritional information
- Meal summary and recommendations
- Food detection using image classification
- Calorie tracking and management
- Responsive design for both Android and iOS

## Technologies Used

- **React Native**: For building the mobile application.
- **Expo**: For easier development and deployment of the React Native app.
- **Firebase**: For authentication and real-time database.
- **React Navigation**: For navigating between different screens.
- **Formik & Yup**: For form handling and validation.
- **Axios**: For making HTTP requests.
- **Date-fns**: For date manipulation.
- **React Native Paper**: For UI components.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nwaniayo/NaijaNutriTrack.git
   cd fitproject
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project and configure Firestore and Authentication.
   - Replace the Firebase configuration in `src/db/firestore.js` with your project's configuration.

4. Run the application:
   ```bash
   npm start
   ```

## Usage

- **Authentication**: Users can sign up and log in to access their personalized data.
- **Food Logging**: Users can log their meals, view their nutritional intake, and receive recommendations.
- **Food Detection**: Users can take photos of food items to classify and log them automatically.
- **Summary Screen**: Users can view a summary of their daily intake and nutritional goals.

## Folder Structure

```
NaijaNutriTrack/
├── src/
│   ├── components/          # Reusable components
│   ├── db/                  # Firebase configuration
│   ├── hooks/               # Custom hooks
│   ├── screens/             # Application screens
│   ├── App.js               # Main application file
│   └── ...
├── .eslintrc.js             # ESLint configuration
├── .gitignore               # Git ignore file
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the React Native and Expo communities for their support and resources.
- Special thanks to Firebase for providing a robust backend solution.
