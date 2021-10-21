import { Currency, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { Route as V2RouteRaw } from '@uniswap/v2-sdk';
import {
  MethodParameters,
  Position,
  Route as V3RouteRaw,
  Trade,
} from '@uniswap/v3-sdk';
import { BigNumber } from 'ethers';
import { CurrencyAmount } from '../util/amounts';
import { IRouteWithValidQuote } from './alpha-router';

export class V3Route extends V3RouteRaw<Token, Token> {}
export class V2Route extends V2RouteRaw<Token, Token> {}

export type SwapRoute = {
  quote: CurrencyAmount;
  quoteGasAdjusted: CurrencyAmount;
  estimatedGasUsed: BigNumber;
  estimatedGasUsedQuoteToken: CurrencyAmount;
  estimatedGasUsedUSD: CurrencyAmount;
  gasPriceWei: BigNumber;
  trade?: Trade<Currency, Currency, TradeType>; // TODO: Re-enable once have single Trade object.
  route: IRouteWithValidQuote[];
  blockNumber: BigNumber;
  methodParameters?: MethodParameters;
};

export type SwapConfig = {
  recipient: string;
  slippageTolerance: Percent;
  deadline: number;
  inputTokenPermit?: {
    v: 0 | 1 | 27 | 28;
    r: string;
    s: string;
  } & (
    | {
        amount: string;
        deadline: string;
      }
    | {
        nonce: string;
        expiry: string;
      }
  );
};

export abstract class IRouter<RoutingConfig> {
  abstract route(
    amount: CurrencyAmount,
    quoteCurrency: Currency,
    swapType: TradeType,
    swapConfig?: SwapConfig,
    partialRoutingConfig?: Partial<RoutingConfig>
  ): Promise<SwapRoute | null>;
}

export abstract class ISwapToRatio<RoutingConfig, SwapAndAddConfig> {
  abstract routeToRatio(
    token0Balance: CurrencyAmount,
    token1Balance: CurrencyAmount,
    position: Position,
    swapAndAddConfig: SwapAndAddConfig,
    swapConfig?: SwapConfig,
    routingConfig?: RoutingConfig
  ): Promise<SwapRoute | null>;
}
