# Website

## Overview

**Objective**: Develop a simple, functional website that can dynamically assign tasks. The website should:

1. Allow students to create accounts, set up passwords, and reset passwords.
2. Enable students to log in and request tasks, dynamically assigning tasks based on previous assignments.
3. Record students' answers to tasks and store them (even in a simple file) to facilitate dynamic task assignment and result checking later.

## Features

1. **User Authentication**: Students can create accounts, set up passwords, and reset them as needed.
2. **Dynamic Task Assignment**: Students can log in and request tasks, which will be assigned based on previous assignments.
3. **Task Recording**: Students' answers to tasks are recorded and stored for dynamic assignment and later review.

## Prerequisites

- A Linux machine (can be a virtual machine)
- At least 1 CPU, 1 GB RAM, and 1 GB free space
- Docker installed ([Installation guide](https://docs.docker.com/engine/install/))

## Setup and Deployment

1. Clone this repository:
2. Edit the `.env` file with your specific configurations.
3. Make the deployment script executable and run it:

```sh
chmod u+x deploy.sh
./deploy.sh
```
