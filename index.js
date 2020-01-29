const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
var reqCount = 0;

server.use((req, res, next) => {
  reqCount++;
  console.log(`${reqCount} api calls`);
  next();
});

function findProject(id){
  return projects.find(prj => prj.id == id);
}

function projectExists(req, res, next){
  const { id } = req.params;
  const project = findProject(id);
  if (!project){
    return res.status(400).json({ error : `Project ${id} not found`});
  }
  next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
    tasks : []
  });

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = findProject(id);

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;
  const index = findProject(id);

  projects.splice(index, 1);

  projects.slice()

  return res.send();
});

server.post("/projects/:id/tasks", projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = findProject(id);
  project.tasks.push(title);
  
  return res.json(projects);
});

server.listen(3000);