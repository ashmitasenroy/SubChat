

# 🚀 Chatbot Application – SuperPost

This project was built as part of an **Internship Assessment** to design and implement a **secure, full-stack chatbot application**.
It integrates **authentication, real-time messaging, chatbot automation, and workflow orchestration** using modern tools and best practices.

The chatbot ensures:

* **Secure authentication** with Nhost (email-based login/signup).
* **Role-based access control** with Hasura (Row-Level Security).
* **GraphQL-only communication** (queries, mutations, subscriptions).
* **Automated chatbot responses** powered by n8n workflows and OpenRouter AI.
* **Modern frontend** built with React + Vite.

---

## 🛠️ Tech Stack

* **Frontend:** React + Vite
* **Backend & Database:** Nhost (Postgres + Hasura GraphQL Engine)
* **Authentication:** Nhost Auth (email-based)
* **Chatbot Workflow:** n8n (with HTTP Requests, Webhooks, Conditionals)
* **AI API:** OpenRouter (LLM responses)
* **Hosting:** Netlify (frontend deployment)

---

## 🔐 Features

### 1. Authentication

* Email-based sign-up & login using Nhost Auth.
* Only authenticated users can access chats & messages.

### 2. Database & Permissions

* Two main tables:

  * `chats` – stores chat metadata.
  * `messages` – stores user & chatbot messages.
* **Row-Level Security (RLS):** Users can only view and interact with their own data.
* Strict permissions for `insert`, `select`, `update`, and `delete`.

### 3. GraphQL-Only Communication

* All frontend interactions are via **Hasura GraphQL API** (queries, mutations, subscriptions).
* No REST calls from the frontend.

### 4. Hasura Actions

* A custom **`sendMessage` action** triggers an n8n webhook.
* Action is secured with authentication & role-based permissions.

### 5. n8n Workflow (Chatbot Logic)

* Receives webhook requests from Hasura Actions.
* Validates ownership of the `chat_id`.
* Calls **OpenRouter API** to generate chatbot replies.
* Saves chatbot responses back into the database via Hasura GraphQL.
* Returns the response to Hasura → frontend updates in real-time.

### 6. Frontend (React + Vite)

* **Chat List View** – shows all chats for the logged-in user.
* **Message View** – real-time updates using GraphQL subscriptions.
* **Send Message Flow:**

  1. Save user’s message in the database.
  2. Trigger Hasura Action → n8n workflow.
  3. Display chatbot response in real-time.

---

## ⚙️ Workflow Explanation (n8n)

The attached diagram shows the chatbot workflow:

1. **Webhook Node** – Receives request from Hasura Action.
2. **HTTP Request – Security Check** – Ensures user owns the `chat_id`.
3. **If Node** – Validates request authenticity.

   * **True Path:** Calls OpenRouter API → Saves response to DB → Returns reply.
   * **False Path:** Responds with error message.
4. **Final Webhook Response** – Sends chatbot’s reply back to Hasura → frontend updates instantly.

5. Workflow-Flowchart
   
 ```
Webhook 
   |
   v
HTTP Request - Security Check
   |
   v
   [IF Node]
   |------- false -------> Respond to Webhook (Error ❌)
   |
   |--- true ------------> HTTP Request (OpenRouter API)
                             |
                             v
                        HTTP Request (Save to Hasura DB)
                             |
                             v
                       Respond to Webhook (Reply ✅)
  ```

## 🚀 Deployment

* **Frontend:** Deployed on Netlify.
* **Backend & Database:** Hosted with Nhost.
* **Chatbot Workflow:** Hosted on n8n Cloud / self-hosted.

---

## 📖 How to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/superpost-chatbot.git
   cd superpost-chatbot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   * **Nhost backend URL & GraphQL endpoint**
   * **OpenRouter API key**
   * **n8n webhook URL**

4. Run the project locally:

   ```bash
   npm run dev
   ```


---

✨ *This project demonstrates secure full-stack development with GraphQL, workflow automation, and AI-powered chatbot responses.*

---

Do you want me to also **add sample GraphQL queries & mutations** (like `sendMessage`, `insert_message`, `get_chats`), so the README looks even more technical and impressive?
