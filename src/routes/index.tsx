import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Game } from '../pages/game/Game';
import { Start } from '../pages/start/Start';
import { Room } from '../pages/room/Room';
import { SlaveRoom } from "../pages/slave-room/SlaveRoom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Start />,
  },
  {
    path: '/room',
    element: <Room />,
  },
  {
    path: '/room/:id',
    element: <Game isHost={true} />,
  },
  {
    path: '/room/:id/slave/init',
    element: <SlaveRoom />,
  },
  {
    path: '/room/:id/slave',
    element: <Game isHost={false} />
  }
]);

export const Routes = () => <RouterProvider router={router} />;
