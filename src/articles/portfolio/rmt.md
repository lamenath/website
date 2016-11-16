# Restaurant Management Tool
RMT (Restaurant Management Tool) is a software solution we built which aims at simplifying the tasks that waiters, chefs and managers need to complete when running a restaurant. It started as a client job, but it is now continuing to grow and new features keep being added as the first adopters of the product go on sharing their ideas and needs; as of now, RMT allows you to collect orders at the tables, print the orders at different locations of the restaurant (e.g. - at the bar and at the kitchen), gather statistics on the business' sales trends.

![RMT screen](/assets/img/rmt.png)

## The client
Meet Bob. Bob owns a small restaurant in the neighborhood, he's a really good chef, people love the food and the atmosphere, waiters are swift and cool. However Bob and his employees are not enough in number to sustain the amount of work that needs to be done. Too many and too different things to do for too few people are ruining the business of Bob's restaurant, due to the unbearable amount of mistakes and miscommunication episodes that affect the quality of the service.

> I'm not gonna lie, I was set up for failure there. Working with West Wing Solutions simply saved my business, they took over my case as if it were their own, showed both professionality and care for my goals and difficulties, and simply systemathically removed all the obstacles my team was facing every night.

Bob wants to translate some of the repetitive, slow and manual work to the computer. The goal here is to remove or alleviate some of the pain points that are excruciating his business, especially those tasks that are continuously standing in the way of the waiters, terribly slowing down the system.

## Identifying the pain points
As for every problem, we start by focusing on the pain points the client is experiencing in her life, which ultimately led her to us; by doing this, we believe we are in the right position to align with the client's goals, frame the problem at hand, and design the perfect solution. After sitting in with Bob and his staff for several sessions, we came up with a clear list of what were the major pain points that we were up to fix.

> I entered the room sweating. I was afraid that I would not be able to explain to the guys how deeply wrong some things used to be; but they took over the room and gently guided me through what looked like a really polished and organized process. 3 hours later, I got out of the meeting full of hope and energy.

So, Bob has some specific needs and struggles. And if you take away anything from this piece, I want it to be this: **we believe that the best work comes out of a sincere and empathetic relationship between the client and us**; we took at heart Bob's objectives while striving to realize the most suitable solution for the case, always keeping in mind the special characteristics that this job had. It was clear that, for this project, a few constraints would apply:
- Keep low materials cost: e.g. additional hardware
- Develop for an environment with no internet connectivity: infact, in Bob's restaurant there's no network
- Ensure that low technical skills were required for the configuration and the maintainance of the product

Regarding the day-to-day problems, we identified a few main pain points:
- Taking orders is slow, subject to mistakes in both writing them and then reading them in the kitchen. Especially when they are in a hurry, they tend to misspell and rewrite several times the same things
- Communication with the bar and kitchen is complex and another stage subject to mistakes: waiters need to either keep a separate list for the drinks, to be brought to the bar, or copy down twice the orders; most painfully, paper orders can be lost or become unreadable when passed in to the chaotical kitchen

## The solution
We like to sum up the goal in a single, concise sentence that's easy to refer to while developing our solutions. For Bob, we identified that the root problem was the number of steps that they needed to take for every client, leaving room for mistakes and miscommunication and slowing down the whole process:

> Reduce the number of steps

So that's what we did. We needed to design an application capable of handling most of the work on Bob's behalf, one that could be used on a mobile device for the waiters to be able to take the orders, one designed with a special focus on speed and ease of use, and lastly but most importantly, one that would be connected to some printing system, in order to easily get the orders in different places: the kitchen, the bar, the cashier and the table.

![Image of post-it with the sentence "Reduce the number of steps"](/assets/img/rmt-postit.jpg)

### Costs containment
First of all, let's discuss the decision to go for a Web App for a moment. Most of the solutions out there involve complicated dedicated hardware, a really specific configuration, and a lot of unneeded steps; by developing a web application, we allowed Bob to simply fetch an old low-end 7 inches tablet and to affordably replace those costly solutions.

### No connectivity problem
In addition to this, in order to allow our web app to work in an offline environment such as Bob's restaurant, we brought in a simple (and very cheap!) Raspberry Pi, which we set up to run a NodeJS server. This allowed us to achieve a number of goals:
- Set up a local network that would distribute the app, without the need for Internet connectivity
- No need to install the app in many devices, as you would with a native Android or iOS app, thus keeping configuration and set up complexity low
- Easy integration with a printing server, that would dispatch the order to a couple of thermal printers displaced around the restaurant

### Simplicity of configuration
Our desire here was to adhere as closely as possible to Bob's current process of doing things. We noticed how Bob was already maintaining a spreadsheet for its menu; thus we allowed him to simply import it in the app, after saving it as a CSV file (which is easily achieved through any office suite software)

### Simplicity of use
Alright, here is where we really put a lot of effort. According to our analysis, the app needed to be:
- **Responsive**, so that it could be accessed in tables and phones
- **Quick and simple**, getting out of the waiters' way, allowing them to be as productive as possible. We tested thoroughly with them, making sure that they always had the needed feature one click always
- **Helpful**, because nobody needs an app that complicates things for you. We added features, such as quick notes, that everybody felt necessary, and purposefully removed those ones that felt like nice-to-haves.

## Impact on the Restaurant
We have been so pleased to hear from Bob that RMT helped his business so much. Here's what had a real impact:
- _Menu Management_: the app allows Bob to easily set up and update the menu, which is then available for the waiters to select the items that get ordered at the different tables. It might seem a basic feature at first, but it allowed the team to be always up to date with newest items in the menu. **Less communication sometime means a faster process**.
- _Rooms and Tables Management_: RMT allows Bob to configure how many rooms there are, how many tables they contain, and how to differentiate them by name or number. Later, the waiters can see which tables are already taken and which ones are free to sit new customers. Needless to say, **customers noticed** how knowledgable waiters seemed about where to sit them, without the need to go and lood around the room: it speaks to their professionality.
- _Orders Management_: here's the core point of the whole system. RMT allows waiters to generate orders and to associate them to the corresponding combination of tables, to quickly allow insertion of notes and additions (_can I have a pizza Margherita without tomatoes and addition of pepperoni?_). Moreover, waiters can finally remove, update and modify items without rewriting and scraping the orders. This meant **no more line-throughs or hard-to-read on-the-fly corrections**; such a feature alone has reduced the number of misinterpretations in the kitchen by a huge amount!
