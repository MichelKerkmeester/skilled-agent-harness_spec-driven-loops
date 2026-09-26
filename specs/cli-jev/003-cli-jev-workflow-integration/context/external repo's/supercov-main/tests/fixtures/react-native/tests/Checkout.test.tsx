import React from 'react';
import {
  render,
  screen,
  userEvent,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { Checkout, Delayed, platformName } from '../src/Checkout';
test('native input, press and async success', async () => {
  const save = jest.fn().mockResolvedValue(undefined);
  const user = userEvent.setup();
  await render(<Checkout save={save} />);
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  await user.type(screen.getByLabelText('Name'), 'Ada');
  expect(screen.getByLabelText('Name')).toHaveDisplayValue('Ada');
  await user.press(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent('Saved'),
  );
  expect(save).toHaveBeenCalledWith('Ada');
  expect(screen.getByText(platformName)).toBeOnTheScreen();
});
test('native failure path', async () => {
  await render(<Checkout save={() => Promise.reject(Error('offline'))} />);
  await fireEvent.changeText(screen.getByLabelText('Name'), 'Lin');
  await fireEvent.press(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByText('Failed')).toBeOnTheScreen();
});
test('effect-driven native rendering', async () => {
  await render(<Delayed load={() => Promise.resolve('Loaded')} />);
  expect(await screen.findByText('Loaded')).toBeVisible();
});
test('native snapshot', async () => {
  const view = await render(<Checkout save={async () => {}} />);
  expect(view.toJSON()).toMatchSnapshot();
});
