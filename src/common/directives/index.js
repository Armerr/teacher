import draggable from '@common/directives/draggable';
import rightMenu from '@common/directives/rightMenu';

export const setupDirectives = (app) => {
  app.use(draggable);
  app.use(rightMenu);
};
