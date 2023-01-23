import express, {
  Express,
  Request,
  Response
} from "express";
import { sqlInjectionPrevention } from "./5-sql-injection-prevention";

const app: Express = express()

app.get(
  '/test',
  sqlInjectionPrevention,
  (req: Request, res: Response) => {
    res.json(req.query)
  }
)

app.listen(8000, () => {
  console.log('server is running');
})