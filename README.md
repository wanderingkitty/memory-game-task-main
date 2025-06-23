# Memory Game Task

Get started with your Memory Game Task! Please read the instructions carefully.

## Table of Contents

- [Requirements](#requirements)
- [Setup](#setup)
- [Install](#install)
- [Run](#run)
- [Instructions](#instructions)
- [Questions](#ℹ️-questions)
- [Contributors](#contributors)

## Requirements

- MacOS, Linux or Windows
- Git
- Node 20+

## Setup

Fork this project and clone it to your computer to start editing.

The project structure is as follows:

```text
memory-game-task/
├── package.json           # Root workspace config
├── docs/                  # Documentation for the project
│   └── README.md          # Contains designs for guidance
├── apps/
│   ├── client/            # React frontend
│   │   ├── package.json
│   │   └── src/
│   └── server/            # Node + Express server
│       ├── package.json
│       └── src/
```

## Install

In the root of the project run the install command.

```shell
# Run in root of project
npm install
```

## Run

### Running the Server

The server should be run before the client.

```shell
# Run in root of project
npm run server
```

> ✅ The server will start on [http://localhost:3000](http://localhost:3000)

### Server API Routes

- **GET** /api/high-scores
  - Content-Type: application/json
- **POST** /api/high-scores
  - Content-Type: application/json
  - Body: See example request body

### Creating a new score

Example Body for the POST api/high-scores:

```json
{
    "player": "Dewald",
    "guesses": 12,
    "timeTakeInSeconds": 60
}
```

### Running the Client

```shell
# Run in root of project
npm run client
```

## Instructions

We would like for you to implement the Memory game. This is a card game where pairs of cards contain images, such that for each card, there is exactly one other card with the same image. The cards are placed face-down on a surface. A player chooses any two cards and flips them face-up. If they happen to have the same image, they will stay face-up — otherwise, they should be flipped back. This continues until all cards are face-up.

> ℹ️ NOTE:
>
> The Project is setup to use React with Typescript for the client and Node + Express + TypeScript for the server.

### ⏰ How long should I spend on the task?

We expect you to spend no more than 5-6 hours on the task (this is both to not put too much work on you, and also to scope how much code we will go through in the interview). We’ll test your game using Chrome, so make sure it works there at least. 😉

> Note: Try to keep in mind that we might want to extend this game later on (maybe even during the interview), so think about the readability and structure of your code.

### 🎮 Features

There are a lot of areas you could choose to focus on in this game, for instance:

- Finding awesome cat/ninja/catninja pics to put on the cards. Static or dynamic?
- Does a player get points? Is there timing involved? A scoreboard?
- Responsive design that works for mobile and desktop?
- A score board over everyone who has played on your server? Maybe even a database of scores??
- Fancy animations or pure-and-simple?
- Accessibility?
- Single-player? Local multi-player? Networked multi-player? 🙀

> ⚠️ Beware that if you try and focus on all of these, you’ll probably spend more than the 5-6 hours, so we advise you to just choose a few. It's better to do one thing well rather than have many things incomplete.

### 👩‍🏫 Additional guidance

It would be helpful if you could document your project (through comments or README files) and explain some of the decisions/assumptions you have made. Given the short time constraints, please also make notes of future steps you could take in order to make the application better. Documentation is a really important aspect, and we expect this.

We have created a starter kit project to help you with boilerplate. It includes babel, css with [Vite](https://vitejs.dev/).

### 🎨 Designs

- Link to designs: [Designs](./docs/README.md)

We have also included some basic wireframes from our designer in the /designs folder. Feel free to use them as a guide, or not, if you feel like you want to show off your design prowess!

## ℹ️ Questions?

Don't hesitate to get in touch with us at any time throughout this task if you have any questions. We realise and appreciate that you’re taking personal time out to complete this task, so we’re happy to help.

## Contributors

- [@dewald-els](https://github.com/dewald-els)
