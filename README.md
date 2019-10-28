[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/joln17/trading-api/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/joln17/trading-api/?branch=master)
[![Code Coverage](https://scrutinizer-ci.com/g/joln17/trading-api/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/joln17/trading-api/?branch=master)
[![Build Status](https://scrutinizer-ci.com/g/joln17/trading-api/badges/build.png?b=master)](https://scrutinizer-ci.com/g/joln17/trading-api/build-status/master)

# Trading-API för projektet i jsramverk
Ett API för att hantera användarkonton och depåer kopplade till användarkontona där (fiktiva) insättningar kan göras och köp/sälj av (fiktiva) värdepapper kan genomföras.

## Tillgängliga skript
I projektets rotkategori kan följande kommandon köras:

* `npm start` Kör i utvecklingsläge.
* `npm test` Kör tester med Mocha och NYC.
* `npm run production` Kör i produktionsläge.

## Tillgängliga router
* `POST /auth/register` Registrera en ny användare.
* `POST /auth/login` Logga in.
* `GET /auth/verify-login` Verifiera inloggning.
* `GET /account/holdings` Erhåll innehaven i depån (inkl. saldo).
* `POST /account/deposit` Gör en ny insättning.
* `POST /trade/buy` Genomför ett köp.
* `POST /trade/sell` Sälj ett innehav.

## Teknikval
För servern används Node.js med [Express](https://www.npmjs.com/package/express). För att hantera "Cross-Origin Resource Sharing" och logga HTTP-requests används middlewaren [CORS](https://www.npmjs.com/package/cors) respektive [Morgan](https://www.npmjs.com/package/morgan). För att hasha lösenord och autentisera klienter används [bcrypt.js](https://www.npmjs.com/package/bcryptjs) respektive [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).

Samtliga paket har använts i tidigare kursmoment och eftersom de har fungerat bra och det var begränsat med tid så valde jag att inte lägga tid på att testa andra alternativ.

När det kommer till databasen valde jag att använda Sqlite över NoSQL-databasen MongoDB, som båda använts i tidigare kursmoment. Efter en kort research så tycktes hederlig SQL vara lämpligare för ACID-transaktioner än NoSQL. Just kombinationen Sqlite och Node visade sig dock ha en del [problem](https://github.com/mapbox/node-sqlite3/issues/304) med transaktioner så hade jag gjort om valet nu i efterhand hade jag nog valt en vanlig MySQL-databas.

## Tester
För integrationstesterna används [Mocha](https://www.npmjs.com/package/mocha) tillsammans med [Chai](https://www.npmjs.com/package/chai) och för att rapportera kodtäckning [Istanbul (nyc)](https://www.npmjs.com/package/nyc). Som CI-verktyg valde jag Scrutinizer som vi använt tidigare i kursen och som erbjuder såväl gradering av kodkvalitet som kodtäckning vilket var ett av kraven. Travis som vi också använt tidigare i kursen erbjuder inte det och jag valde att inte lägga tid på att konfigurera och testa andra CI-verktyg.

Jag upplever att samtliga testverktyg fungerat bra och det var smidigt att konfigurera och skriva tester för att erhålla testresultat och kodtäckning. Testerna hjälpte mig också att upptäcka en bugg som jag tidigare missat i hanteringen av försäljning av värdepapper.

När det kommer till kodtäckning så nådde jag 82 % och det är främst databasfel som jag inte har några tester för. Scrutinizers verktyg för kodkvalitet gav mig 10.0 men repot innehåller å andra sidan mest simpel kod för databas-anrop så jag vet inte om det säger så mycket.

I övrigt har jag använt ESLint tillsammans med [VS Codes ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) för att få validering av kodstilen enligt [JavaScript Style Guide](https://www.npmjs.com/package/javascript-style-guide) direkt när koden skrivs i editorn.
