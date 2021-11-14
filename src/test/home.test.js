import Home from '../containers/Home';
import { render, waitFor, fireEvent, act } from '@testing-library/react';
import React from "react";
import AppProviders from "../context/appProviders";

describe('Home', () => {
  it('renders currency exchange home page', async () => {
    const { getByText } = render(
      <AppProviders>
        <Home />
      </AppProviders>
    );

    const button = getByText(/Exchange/i);
    const fromSelect = getByText(/USD/i);
    const toSelect = getByText(/GBP/i);
    const fromBalance = getByText(/Balance:200.00\$/i);
    const toBalance = getByText(/Balance:10.00£/i);

    expect(button).toBeTruthy();
    expect(fromSelect).toBeTruthy();
    expect(toSelect).toBeTruthy();
    expect(fromBalance).toBeTruthy();
    expect(toBalance).toBeTruthy();
  });

  it('renders exceeds error', async () => {
    const { getByText, getByTestId } = render(
      <AppProviders>
        <Home />
      </AppProviders>
    );

    const fromField = getByTestId('withdraw-field').querySelector('input');
    const exchangeButton = getByTestId('exchange-button');

    act(() => {
      fireEvent.change(fromField, { target: { value: '1000' }});
    });

    await waitFor(() => {
      expect(getByText('Exceeds balance')).toBeTruthy();
      expect(exchangeButton.disabled).toBe(true);
    })
  });

  it('renders changed fromCurrency', async () => {
    const { getByText, getByTestId } = render(
      <AppProviders>
        <Home />
      </AppProviders>
    );

    const fromCurrency = getByTestId('fromCurrency-select').querySelector('input');

    act(() => {
      fireEvent.change(fromCurrency, { target: { value: 'EUR' }});
    });

    await waitFor(() => {
      expect(getByText('Balance:150.00€')).toBeTruthy();
    })
  });

  it('renders the same fromCurrency and toCurrency', async () => {
    const { getByTestId } = render(
      <AppProviders>
        <Home />
      </AppProviders>
    );

    const fromCurrency = getByTestId('fromCurrency-select').querySelector('input');
    const toCurrency = getByTestId('toCurrency-select').querySelector('input');
    const exchangeButton = getByTestId('exchange-button');

    act(() => {
      fireEvent.change(fromCurrency, { target: { value: 'EUR' }});
      fireEvent.change(toCurrency, { target: { value: 'EUR' }});
    });

    await waitFor(() => {
      expect(exchangeButton.disabled).toBe(true);
    })
  });
});

