Currently -
Backend runs on 3000 port
Frontend runs on 5173 port

But in production, Both run on same domain.
How can we do that ?

Answer - npm run build // frontend folder
         It generates a dist folder, which is a static folder
         It has js file that consists of all the code of frontend.

         Move content of dist folder to Backend/public
         express.static("public");
         Now the app starts running on 3000 port
 
         Whenever the new changes made in frontend, we have to build the frontend again. 
         npm run build
         Move content of dist folder to Backend/public


PS D:\Real-time-code-collaborator> `docker ps -a`
CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS                        
PS D:\Real-time-code-collaborator> `docker rm 4935bb0d01ff`
4935bb0d01ff
PS D:\Real-time-code-collaborator> `docker rmi backend:latest`
Untagged: backend:latest
Deleted: sha256:2e65d9be1ce626228b68c02669f8b20c6327c67413c84efd7d8bd7f26009b04c
PS D:\Real-time-code-collaborator> `docker images`
PS D:\Real-time-code-collaborator> `docker run -p 4000:3000 -d backend:latest`  // used to run backend as we can not run the server by our original OS


         Your Laptop
     ---------------------
        Frontend   Backend
             │
        Docker Build
             │
             ▼
      Docker Images Created
             │
             ▼
   Push Images to Amazon ECR
             │
             ▼
      Amazon ECR (Registry)
     Stores Docker Images
             │
             ▼
     Amazon ECS Cluster
             │
      Pulls Images from ECR
             │
             ▼
     Runs Docker Containers
             │
             ▼
        Users Access App