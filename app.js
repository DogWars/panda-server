const Koa = require('koa');
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const path = require('path');

const app = new Koa();

// error handler
onerror(app);

// middlewares
app.use(bodyparser({ enableTypes: ['json', 'form', 'text'] }));
app.use(json());
app.use(logger());
app.use(require('koa-static')(path.resolve(__dirname, '/public')));
app.use(views(path.resolve(__dirname, '/views'), { extension: 'pug' }));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
const user = require('./routes/user');
app.use(user.routes(), user.allowedMethods());

app.listen(3000, () => {
  console.log('服务器启动成功');
});
