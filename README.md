# BookBay

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description

BookBay offers a streamlined and secure mobile platform for textbook transactions within our school's community. Leveraging advanced technologies, the app ensures real-time functionality, a user-friendly interface, and a dependable rating system. By focusing on the specific needs of our campus, BookBay provides an efficient and dedicated space for buying and selling textbooks, revolutionizing the current landscape with a straightforward and effective solution.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install and set up the BookBay app, follow these steps:

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your machine. Download and install it from [Node.js official website](https://nodejs.org/).
- **npm** (Node Package Manager): Comes with Node.js, used for managing dependencies.
- **Watchman**: Recommended for macOS users, for better performance with Metro. Install via Homebrew:
  ```
  brew install watchman
  ```

### Install Dependencies

Navigate to your project directory and run:
```
npm install
```
This will install all the necessary dependencies from the `package.json` file.

## Setup

To run the project with Expo:

1. **Start the Project**:
   - Open your terminal.
   - Navigate to the project directory.
   - Run the following command:
     ```
     npx expo start
     ```

2. **Run the App**:
   - In the terminal , you will see several options to run your application:
     - **Run on iOS Simulator**: Works if you are on a Mac with Xcode installed.
     - **Run on Android Emulator**: Ensure you have an Android emulator installed and running.
     - **Run in web browser**: Starts a web version of the app.
     - **Scan QR Code with your device**: Use the Expo Go app on your iOS or Android device to scan the QR code and run the app directly on your mobile device.

3. **Adding Firebase Configurations**
   - Create a firebase project and copy the configuartion object provided
   - In the app src code, copy the `firebase.example.config.js` file to a new file named `firebase.config.json`
     - Replace the configuration object in the config file with the one copied from firebase
     - If any of the values are missing, check for them on firebase project overview or settings screen
   - Re-run the project if necessary
     
   **WARNING: Do not add `firebase.config.json` to github as it contains your firebase API keys**

## License

This project is licensed under the [MIT License](LICENSE).
