import express, {
  Express,
  Request,
  Response
} from "express";

const app: Express = express()

app.get(
  '/test',
  (req: Request, res: Response) => {
    res.json(req.query)
  }
)

app.listen(8000, () => {
  console.log('server is running');
})