# Ableton Setlist Manager (Web)
![Screenshot 2024-04-28 at 00 56 22](https://github.com/joohnnyvv/ableton-setlist-manager-web/assets/110868938/d1b34552-10fa-44be-b2ec-6d13b8abcaf3)

## Overview

The Ableton Setlist Manager is a [React](https://github.com/facebook/react)-based client application designed to work in tandem with the [Setlist Management Server](https://github.com/joohnnyvv/setlist-mgmt-server) for managing setlists and controlling playback in Ableton Live. It provides an intuitive user interface for interacting with Ableton Live and accessing real-time updates through WebSocket communication.

## Features

- **Fetching and displaying** cue points from Ableton Live sets.
- **Controlling** playback in Ableton Live.
- **Updating** cue order.
- **Setting** loop areas.
- **Selecting** songs and parts for playback.
- **Toggling** loop mode.
- **Real-time** updates for song time, playback status, tempo changes, loop mode, and song/part progress.

## Tech Stack

- [**React**](https://github.com/facebook/react): Frontend library for building user interfaces.
- [**Material-UI (MUI)**](https://mui.com/): React component library for UI design.
- **WebSocket**: Enables real-time communication with the Setlist Management Server.
- [**Axios**](https://github.com/axios/axios): HTTP client for making requests to the server.

## Run Locally

1. **Clone the repository**: `git clone https://github.com/joohnnyvv/ableton-setlist-manager-web`
2. **Navigate to the project directory**: `cd ableton-setlist-manager-web`
3. **Install dependencies**: `npm install`
4. **Run [server](https://github.com/joohnnyvv/setlist-mgmt-server)**
5. **Start the development server**: `npm start`
6. **Access the application in your browser at**: [http://localhost:3000](http://localhost:3000)

## Usage/Examples

1. **Browse and select cue points from the fetched setlist.**

![Screenshot 2024-04-28 at 00 58 17](https://github.com/joohnnyvv/ableton-setlist-manager-web/assets/110868938/12ed6b8a-c805-4d7b-a5a8-912db0b1e9e7)
 
2. **Control playback by starting, stopping and looping**
 
![Screenshot 2024-04-28 at 00 59 59](https://github.com/joohnnyvv/ableton-setlist-manager-web/assets/110868938/c3a970a7-b3c4-4e5c-93eb-87ca3c8b226d)

3. **Update cue order as needed.**

![Screenshot 2024-04-28 at 01 01 12](https://github.com/joohnnyvv/ableton-setlist-manager-web/assets/110868938/17866093-763c-4426-b868-c770722c86c3)

4. **Set loop areas for selected sections of songs or whole songs.**

![Screenshot 2024-04-28 at 01 02 28](https://github.com/joohnnyvv/ableton-setlist-manager-web/assets/110868938/8afaef07-1072-481d-aa18-40e3951b1ff1)

5. **Select songs and parts for playback.**

![Screenshot 2024-04-28 at 01 03 48](https://github.com/joohnnyvv/ableton-setlist-manager-web/assets/110868938/bdbb7735-6940-4691-87e2-ae975057378c)

6. **Decide whether you want to continue playback after the song ends**

![Screenshot 2024-04-28 at 01 04 18](https://github.com/joohnnyvv/ableton-setlist-manager-web/assets/110868938/be497b49-5030-4638-a8bf-babbc15d6707)

## Authors

- [@joohnnyvv](https://github.com/joohnnyvv)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/joohnnyvv/ableton-setlist-manager-web/blob/master/LICENSE.MD) file for details.
