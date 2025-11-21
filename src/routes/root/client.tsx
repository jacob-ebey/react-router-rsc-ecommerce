"use client";

import { on } from "@remix-run/interaction";
import {
  startTransition,
  useCallback,
  useEffect,
  useState,
  ViewTransition,
} from "react";
import {
  isRouteErrorResponse,
  Link,
  NavLink,
  ScrollRestoration,
  useNavigation,
  useRouteError,
} from "react-router";

import { Grid, GridCol, GridRow } from "@/components/grid/grid";
import { MinimumLoadingTime } from "@/components/min-display-time/min-display-time";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import { decodeError, StatusCodeError } from "@/lib/errors";

import { cartSetOpenEvent, CartSetOpenEvent } from "./events";

export function setCartOpen() {
  startTransition(() => {
    dispatchEvent(new CartSetOpenEvent(true));
  });
}

export function Shell({
  cart,
  cartCount,
  children,
}: {
  cart: React.ReactNode;
  cartCount?: Promise<number>;
  children: React.ReactNode;
}) {
  const navigation = useNavigation();
  const [cartOpen, _setCartOpen] = useState(false);
  const setCartOpen = useCallback((open: boolean) => {
    startTransition(() => {
      _setCartOpen(open);
    });
  }, []);

  useEffect(
    () =>
      on(window, {
        [cartSetOpenEvent](event) {
          setCartOpen(event.open);
        },
      }),
    [],
  );

  return (
    <html lang="en" className="data-scroll-lock:overflow-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/x-icon"
          href="https://shop.remix.run/favicon.ico"
        />
      </head>
      <body className="p-4 relative">
        <ViewTransition>
          <div className="paper-overlay"></div>

          <div>
            <MinimumLoadingTime
              isLoading={navigation.state !== "idle"}
              minimumLoadingTime={1000}
            >
              <div className="fixed left-0 bottom-0 right-0 bg-transparent z-40 pointer-events-none animate-[slideLeftToRight_3s_linear_infinite]">
                <div className="bg-transparent progress left-right">
                  <img
                    alt=""
                    className="grayscale-1 brightness-2000 invert w-20 h-20"
                    src="https://cdn.shopify.com/s/files/1/0655/4127/5819/files/load_runner.gif?v=1739987429&width=200&height=200&crop=center"
                  />
                </div>
              </div>
            </MinimumLoadingTime>
          </div>
          <Grid>
            <Grid nested>
              <header>
                <GridRow className="grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto] overflow-x-auto">
                  <GridCol className="hidden sm:flex p-4 aspect-square items-center justify-center sm:h-full">
                    <svg
                      className="h-10 w-10"
                      viewBox="0 0 412 474"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M393.946 364.768C398.201 419.418 398.201 445.036 398.201 473H271.756C271.756 466.909 271.865 461.337 271.975 455.687C272.317 438.123 272.674 419.807 269.828 382.819C266.067 328.667 242.748 316.634 199.871 316.634H161.883H1V218.109H205.889C260.049 218.109 287.13 201.633 287.13 158.011C287.13 119.654 260.049 96.4098 205.889 96.4098H1V0H228.456C351.069 0 412 57.9117 412 150.42C412 219.613 369.123 264.739 311.201 272.26C360.096 282.037 388.681 309.865 393.946 364.768Z"
                        fill="currentColor"
                      />
                      <path
                        d="M1 473V399.553H134.697C157.029 399.553 161.878 416.116 161.878 425.994V473H1Z"
                        fill="currentColor"
                      />
                      <path
                        d="M1 399.053H0.5V399.553V473V473.5H1H161.878H162.378V473V425.994C162.378 420.988 161.152 414.26 157.063 408.77C152.955 403.255 146.004 399.053 134.697 399.053H1Z"
                        stroke="currentColor"
                        strokeOpacity="0.8"
                      />
                    </svg>
                  </GridCol>
                  <GridCol className="flex items-center p-4 sm:block sm:text-center uppercase">
                    <div className="hidden sm:block text-xs sm:text-sm md:text-base">
                      Software for better websites
                    </div>
                    <div className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-nowrap">
                      Remix Store
                    </div>
                    <div className="hidden sm:block text-xs sm:text-sm md:text-base">
                      Soft wear for engineers of all kinds
                    </div>
                  </GridCol>
                  <GridCol className="aspect-square flex text-3xl sm:h-full">
                    <NavLink
                      role="button"
                      to="/cart"
                      className="p-4 -outline-offset-2 hover:text-primary-blue focus-visible:text-primary-blue flex flex-1 aspect-square items-center justify-center"
                      onClick={(event) => {
                        event.preventDefault();
                        setCartOpen(true);
                      }}
                    >
                      <span className="sr-only">
                        View cart - {cartCount} items
                      </span>
                      <div className="relative">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-10 w-10"
                          aria-hidden="true"
                        >
                          <path d="M15.55 13c1.22 0 1.74-1.01 1.75-1.03l3.55-6.44c.23-.45.18-.84-.01-1.11-.18-.26-.51-.42-.84-.42H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H2c-.55 0-1 .45-1 1s.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45z"></path>
                          <circle cx="7" cy="20" r="2"></circle>
                          <circle cx="17" cy="20" r="2"></circle>
                        </svg>
                        <div
                          className="absolute -top-1/2 -right-1/2 text-base p-2"
                          aria-hidden="true"
                        >
                          {cartCount}
                        </div>
                      </div>
                    </NavLink>
                    <Sidebar open={cartOpen} onClose={() => setCartOpen(false)}>
                      <Button
                        size="sm"
                        aria-label="Close cart"
                        className="fixed top-4 right-4 z-20"
                        onClick={() => setCartOpen(false)}
                      >
                        &#10005;
                      </Button>
                      {cart}
                    </Sidebar>
                  </GridCol>
                </GridRow>
              </header>
              <nav>
                <GridRow className="grid-cols-3 sticky top-0">
                  <GridCol className="border-b-2 -mb-0.5 border-border">
                    <NavLink
                      to="/"
                      className="flex items-center justify-center text-center h-full p-4 text-xs sm:text-sm md:text-base font-semibold hover:text-primary-blue focus-visible:text-primary-blue -outline-offset-2 aria-[current=page]:text-primary-blue"
                    >
                      All Products
                    </NavLink>
                  </GridCol>
                  <GridCol>
                    <NavLink
                      to="/c/apparel"
                      className="flex items-center justify-center text-center h-full p-4 text-xs sm:text-sm md:text-base font-semibold hover:text-primary-blue focus-visible:text-primary-blue -outline-offset-2 aria-[current=page]:text-primary-blue"
                    >
                      Apparel
                    </NavLink>
                  </GridCol>
                  <GridCol>
                    <NavLink
                      to="/c/home-office"
                      className="flex items-center justify-center text-center h-full p-4 text-xs sm:text-sm md:text-base font-semibold hover:text-primary-blue focus-visible:text-primary-blue -outline-offset-2 aria-[current=page]:text-primary-blue"
                    >
                      Home & Office
                    </NavLink>
                  </GridCol>
                </GridRow>
              </nav>
            </Grid>

            <GridRow className="">
              <GridCol>{children}</GridCol>
            </GridRow>

            <footer className="text-sm">
              <GridRow>
                <GridCol className="p-4 md:p-6 flex flex-col items-center gap-6">
                  <div className="text-center space-y-2">
                    <p>
                      <Link
                        to="/"
                        className="hover:text-primary-blue focus-visible:text-primary-blue"
                      >
                        Remix Soft Wear Catalog V.1
                      </Link>
                    </p>
                    <p>Designed in USA</p>
                  </div>

                  <svg
                    viewBox="0 0 700 180"
                    fill="none"
                    className="w-64"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M696.11,51.95h-46.39l-21.11,29.44-20.56-29.44h-49.73l44.73,60.82-48.62,63.04h46.39l24.72-33.61,24.72,33.61h49.73l-48.89-64.99,45-58.88Z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M244.89,131.66c-4.17,9.72-11.95,13.89-24.17,13.89-13.61,0-24.72-7.22-25.84-22.5h86.95v-12.5c0-33.61-21.95-61.93-63.34-61.93-38.61,0-67.51,28.05-67.51,67.21s28.34,63.32,68.06,63.32c32.78,0,55.56-15.83,61.95-44.16l-36.11-3.33ZM195.44,101.39c1.67-11.66,8.06-20.55,22.5-20.55,13.33,0,20.56,9.44,21.11,20.55h-43.62Z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M410.33,73.06c-5.28-14.44-16.67-24.44-38.62-24.44-18.61,0-31.95,8.33-38.61,21.94v-18.61h-45v123.87h45v-60.82c0-18.61,5.28-30.83,20-30.83,13.61,0,16.95,8.89,16.95,25.83v65.82h45v-60.82c0-18.61,5-30.83,20-30.83,13.61,0,16.67,8.89,16.67,25.83v65.82h45v-77.76c0-25.83-10-49.44-44.17-49.44-20.83,0-35.56,10.55-42.23,24.44Z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M504.93,51.95v123.87h45V51.95h-45ZM504.65,40.29h45.56V.85h-45.56v39.44Z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M145.12,135.55c1.57,20.18,1.57,29.64,1.57,39.97h-46.7c0-2.25.04-4.31.08-6.39.13-6.49.26-13.25-.79-26.91-1.39-20-10-24.44-25.84-24.44H0v-36.38h75.67c20,0,30-6.08,30-22.19,0-14.16-10-22.75-30-22.75H0V.85h84c45.28,0,67.78,21.39,67.78,55.55,0,25.55-15.83,42.21-37.23,44.99,18.06,3.61,28.61,13.89,30.56,34.16ZM0,175.52v-28.08h49.38c8.25,0,10.04,7.07,10.04,10.72v17.36H0Z"
                    ></path>
                  </svg>

                  <svg
                    viewBox="0 0 146 70"
                    fill="none"
                    className="h-[55px] w-[115px] md:h-[70px] md:w-[146px]"
                    aria-hidden="true"
                  >
                    <path
                      d="M35.3909 0.223511C16.2147 0.223511 0.61377 15.8429 0.61377 35.0419C0.61377 54.2409 16.2147 69.8604 35.3909 69.8604C54.5672 69.8604 70.1681 54.2409 70.1681 35.0419C70.1681 15.8429 54.5672 0.223511 35.3909 0.223511ZM35.3909 62.5774C20.2245 62.5774 7.88808 50.2264 7.88808 35.0419C7.88808 19.8575 20.2245 7.50645 35.3909 7.50645C50.5574 7.50645 62.8938 19.8575 62.8938 35.0419C62.8938 50.2264 50.5574 62.5774 35.3909 62.5774Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M50.7409 44.2084C51.0478 48.1591 51.0478 50.0108 51.0478 52.0301H41.92C41.92 51.5911 41.928 51.188 41.936 50.777C41.9599 49.508 41.9878 48.1831 41.7805 45.5093C41.5095 41.5945 39.8274 40.7246 36.7303 40.7246H22.373V33.6052H37.1648C41.075 33.6052 43.0281 32.416 43.0281 29.2634C43.0281 26.4899 41.075 24.8098 37.1648 24.8098H22.373V17.8422H38.7951C47.6478 17.8422 52.0443 22.0284 52.0443 28.7127C52.0443 33.713 48.9472 36.9733 44.766 37.5201C48.2975 38.2264 50.3582 40.2377 50.7409 44.2044V44.2084ZM22.373 52.0301V46.4711H32.027C33.6373 46.4711 33.988 47.6683 33.988 48.3826V52.0301H22.373Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M134.537 9.65333C133.528 8.6876 132.428 7.76176 131.272 6.89579C125.983 2.95303 119.745 0.622491 113.176 0.107698L113.152 0.0877444L112.244 0.0438472C111.41 0.00394072 110.645 -0.00803123 109.88 0.00394072C109.589 0.00793137 109.302 0.0159127 109.011 0.023894H109.003L108.094 0.0558192L108.07 0.0797631C101.366 0.526716 94.9925 2.86923 89.5915 6.89579C88.4316 7.75777 87.3315 8.6876 86.331 9.64934C79.3278 16.3217 75.4734 25.3246 75.4734 35.0019C75.4734 44.6793 79.2999 53.6063 86.2394 60.2628C87.3196 61.3043 88.4874 62.294 89.7151 63.1999C94.9765 67.0828 101.167 69.3814 107.66 69.8922L107.676 69.9042L108.58 69.956C109.15 69.988 109.756 70.0039 110.434 70.0039C111.112 70.0039 111.705 69.988 112.255 69.956C112.255 69.956 112.255 69.956 112.259 69.956H112.267L113.164 69.9042L113.18 69.8922C119.689 69.3854 125.887 67.0828 131.157 63.1959C132.388 62.286 133.56 61.2963 134.621 60.2667C141.568 53.6103 145.394 44.6354 145.394 34.9979C145.394 25.3605 141.54 16.3177 134.541 9.65333H134.537ZM80.7667 37.5959H91.7997C91.995 41.379 92.6487 45.0743 93.7528 48.654H83.9435C82.1817 45.2419 81.0975 41.5027 80.7667 37.5959ZM121.782 21.4337C123.037 24.9655 123.787 28.6369 124.018 32.408H113.017V21.4337H121.782ZM113.021 16.2459V7.11528C114.938 9.14253 116.644 11.3653 118.115 13.7557C118.609 14.5578 119.079 15.3959 119.526 16.2499H113.025L113.021 16.2459ZM107.839 7.45448V16.2419H101.585C102.016 15.4198 102.478 14.6057 102.972 13.8116C104.387 11.5329 106.018 9.40591 107.839 7.45448ZM107.839 21.4337V32.408H97.0133C97.2644 28.6369 98.0297 24.9655 99.3012 21.4337H107.843H107.839ZM91.8157 32.408H80.7667C81.0975 28.5331 82.1618 24.8258 83.8956 21.4337H93.8286C92.7125 24.9814 92.0389 28.6528 91.8157 32.408ZM96.9894 37.5959H107.839V48.654H99.2135C97.958 45.0943 97.2126 41.395 96.9934 37.5959H96.9894ZM107.839 53.8418V62.8806C105.978 60.8853 104.32 58.7104 102.889 56.3759C102.386 55.5618 101.912 54.7118 101.462 53.8418H107.839ZM113.021 62.8846V53.8378H119.478C119.028 54.6958 118.545 55.5458 118.031 56.3799C116.584 58.7104 114.91 60.8893 113.021 62.8846ZM113.021 48.654V37.5959H124.022C123.787 41.399 123.025 45.0983 121.754 48.654H113.021ZM129.212 37.5959H140.085C139.754 41.5027 138.67 45.238 136.908 48.654H127.215C128.331 45.0783 129 41.379 129.212 37.5959ZM129.216 32.408C129.008 28.6528 128.351 24.9854 127.251 21.4337H136.96C138.694 24.8258 139.762 28.5331 140.089 32.408H129.216ZM130.961 13.4085C131.902 14.3024 132.767 15.2522 133.572 16.2419H125.281C125.19 16.0344 125.098 15.8269 125.002 15.6233C124.257 14.0311 123.424 12.4867 122.527 11.0261C121.571 9.46976 120.518 7.98125 119.39 6.55659C122.531 7.54627 125.497 9.05873 128.179 11.0541C129.168 11.7923 130.104 12.5825 130.965 13.4085H130.961ZM89.9064 13.4006C90.7594 12.5825 91.6921 11.7923 92.6806 11.058C95.4787 8.97492 98.5838 7.42256 101.864 6.43687C100.676 7.91341 99.5683 9.45779 98.5678 11.078C97.6391 12.5825 96.7981 14.1348 96.0687 15.6952L95.8255 16.2219C95.8255 16.2219 95.8215 16.2379 95.8175 16.2459H87.2917C88.0968 15.2522 88.9657 14.2984 89.9104 13.4006H89.9064ZM89.8267 56.5195C88.9418 55.6695 88.1247 54.7716 87.3594 53.8418H95.7059C95.7617 53.9695 95.8175 54.0972 95.8733 54.2249C96.6506 55.9169 97.5235 57.5571 98.4722 59.0975C99.4009 60.6139 100.417 62.0665 101.513 63.4593C98.3964 62.4816 95.4508 60.993 92.7843 59.0257C91.7399 58.2555 90.7475 57.4134 89.8267 56.5235V56.5195ZM131.017 56.5275C130.112 57.4054 129.12 58.2435 128.076 59.0177C125.421 60.9771 122.487 62.4616 119.386 63.4393C120.482 62.0585 121.503 60.6179 122.432 59.1134C123.408 57.5371 124.293 55.901 125.054 54.2528C125.118 54.1132 125.178 53.9735 125.242 53.8378H133.5C132.735 54.7716 131.91 55.6735 131.021 56.5275H131.017Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </GridCol>
                <GridCol>
                  <Grid nested>
                    <GridRow className="md:grid-cols-2 text-center">
                      <GridCol className="p-4 md:p-6 md:text-right space-y-2">
                        <p>Remix is for everyone</p>
                        <p>Remix is an engineering team</p>
                        <p>Remix builds tools for a better web</p>
                        <div className="pt-2.5">
                          <a
                            href="https://remix.run"
                            target="_blank"
                            rel="noreferrer"
                            className="border-2 border-border rounded-full inline-block py-1 px-2 uppercase hover:text-primary-blue focus-visible:text-primary-blue -outline-offset-2"
                          >
                            remix.run
                          </a>
                        </div>
                      </GridCol>
                      <GridCol className="p-4 md:p-6 md:text-left space-y-2">
                        <p>
                          <Link
                            to="/"
                            className="hover:text-primary-blue focus-visible:text-primary-blue"
                          >
                            Refund Policy
                          </Link>
                        </p>
                        <p>
                          <Link
                            to="/"
                            className="hover:text-primary-blue focus-visible:text-primary-blue"
                          >
                            Privacy Policy
                          </Link>
                        </p>
                        <p>
                          <Link
                            to="/"
                            className="hover:text-primary-blue focus-visible:text-primary-blue"
                          >
                            Shipping Policy
                          </Link>
                        </p>
                        <p>
                          <Link
                            to="/"
                            className="hover:text-primary-blue focus-visible:text-primary-blue"
                          >
                            Terms of Service
                          </Link>
                        </p>
                        <p>
                          <Link
                            to="/"
                            className="hover:text-primary-blue focus-visible:text-primary-blue"
                          >
                            Contact Information
                          </Link>
                        </p>
                      </GridCol>
                    </GridRow>
                  </Grid>
                </GridCol>
                <GridCol className="p-4 md:p-6 text-center space-y-2">
                  <p>Docs and Examples licensed under MIT</p>
                  <p>&copy; 2025 Shopify, Inc.</p>
                </GridCol>
              </GridRow>
            </footer>
          </Grid>
        </ViewTransition>

        <ScrollRestoration />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let status = 500;
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = status === 404 ? "Page not found." : error.statusText || message;
  }
  const decoded = decodeError(error);
  if (decoded.success) {
    if (decoded.error instanceof StatusCodeError) {
      status = decoded.error.status;
    }
    message = decoded.error.message;
  }

  return (
    <GridCol>
      <article className="prose max-w-none p-8 md:p-12">
        <h1>{status}</h1>
        <p>{message}</p>
      </article>
    </GridCol>
  );
}
