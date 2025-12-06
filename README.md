# Academic Page
### Running Locally

This is the recommended way to run the website locally to avoid Ruby dependency issues (especially on macOS with Apple Silicon).

**Prerequisites:**

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

**Steps:**

2. Clone your forked repository to your local machine:

   ```bash
   git clone [https://github.com/](https://github.com/)<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ````

3.  Run the following command in the root directory of the repository:

    ```bash
    docker compose up
    ```

4.  Open your browser and visit [http://localhost:4000](https://www.google.com/search?q=http://localhost:4000) to see the website.

    > The website will automatically reload when you modify files. To stop the server, press `Ctrl + C` in the terminal.
