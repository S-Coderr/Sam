/* ============================================================
 * SHL AMCAT Portal clone — Question bank
 * Sections & durations replicate the real AMCAT flow shown in the
 * photos: English Comprehension, Logical Ability, Quantitative
 * Ability (Advanced), Personality, Computer Programming,
 * Automata Pro, Automata Fix, Computer Science.
 * ============================================================ */

'use strict';

const LIKERT_OPTIONS = [
  'Strongly Agree',
  'Agree',
  'Neither agree nor disagree',
  'Disagree',
  'Strongly Disagree'
];

const SECTIONS = [
  {
    id: 'english',    name: 'English Comprehension',        questions: 18, minutes: 18, order: 1,
    description: "This section evaluates the candidate's proficiency in English language. It covers reading " +
      "comprehension, synonyms, antonyms, contextual usage of words, grammar and sentence correction, testing " +
      "the ability to understand and analyse written information."
  },
  {
    id: 'logical',    name: 'Logical Ability',              questions: 12, minutes: 12, order: 2,
    description: "This section assesses the candidate's reasoning skills through questions on deductive and " +
      "inductive logic, number and letter series, blood relations, direction sense, coding-decoding, clocks, " +
      "seating arrangements and pattern recognition."
  },
  {
    id: 'quant',      name: 'Quantitative Ability (Advanced)', questions: 16, minutes: 16, order: 3,
    description: "This section measures advanced mathematical aptitude including permutations and combinations, " +
      "probability, logarithms, arithmetic and geometric progressions, number systems, time speed and distance, " +
      "percentages, profit and loss, and functions."
  },
  {
    id: 'personality',name: 'Personality',                  questions: 72, minutes: 15, order: 4,
    description: "This section evaluates workplace personality traits and behavioural tendencies of the candidate. " +
      "Each statement is rated on a five-point scale from Strongly Disagree to Strongly Agree, and the responses " +
      "are used to build a competency profile of the candidate."
  },
  {
    id: 'programming',name: 'Computer Programming',         questions: 25, minutes: 35, order: 5,
    description: "This section tests the candidate's knowledge of programming fundamentals, including C/C++ " +
      "syntax, data types, operators, control structures, functions, pointers, time complexity and basic data " +
      "structures such as stacks, queues, arrays and linked lists."
  },
  {
    id: 'automata',   name: 'Automata Pro',                 questions: 2,  minutes: 60, order: 6,
    description: "An AI-powered coding simulation assessment that evaluates candidate's programming ability. " +
      "Offers a familiar IDE environment available in over 40 different programming languages and tests " +
      "candidates using real-world coding problems."
  },
  {
    id: 'autofix',    name: 'Automata Fix',                 questions: 7,  minutes: 20, order: 7,
    description: "This section evaluates the candidate's ability to debug and fix syntactically incorrect or " +
      "logically flawed programs. Each question presents a piece of code with errors that must be corrected so " +
      "that it produces the expected output."
  },
  {
    id: 'cs',         name: 'Computer Science',             questions: 20, minutes: 20, order: 8,
    description: "This section assesses core computer science fundamentals, including operating systems, database " +
      "management systems, computer networks, object-oriented programming concepts and data structures."
  }
];

/* ------------------------------------------------------------------
 * ENGLISH COMPREHENSION (18 questions, 18 minutes)
 * ------------------------------------------------------------------ */
const ENGLISH_PASSAGE_1 =
  "Read the passage and answer the questions that follow.\n\n" +
  "The rise of remote work has fundamentally altered the landscape of modern employment. " +
  "What began as a necessity during global disruptions has evolved into a preferred working model " +
  "for millions of professionals. Companies have discovered that distributed teams can be as " +
  "productive as their office-bound counterparts, provided that communication channels remain " +
  "robust and expectations are clearly defined. However, remote work is not without its challenges. " +
  "Employees often report feelings of isolation, and the boundaries between professional and " +
  "personal life can blur, leading to burnout. Organizations that succeed in this new environment " +
  "are those that invest deliberately in virtual collaboration tools, foster a culture of trust " +
  "rather than surveillance, and measure outcomes instead of hours. As the labour market tightens, " +
  "the ability to offer flexible arrangements has become a decisive factor in attracting and " +
  "retaining top talent - one that no forward-thinking employer can afford to ignore.";

const BANK = {};

BANK.english = [
  { passage: ENGLISH_PASSAGE_1, text: 'What is the primary purpose of this passage?',
    options: [
      'To criticize companies that mandate office attendance',
      'To discuss how remote work has transformed employment, its challenges, and what successful organizations do',
      'To argue that remote work reduces productivity',
      'To describe the history of the internet'
    ], answer: 1 },

  { passage: ENGLISH_PASSAGE_1, text: 'According to the passage, remote employees most commonly report:',
    options: [
      'Higher salary packages',
      'Feelings of isolation and blurred work-life boundaries',
      'Improved physical health',
      'Longer commuting hours'
    ], answer: 1 },

  { passage: ENGLISH_PASSAGE_1, text: 'Which of the following best describes organizations that succeed with remote work, according to the passage?',
    options: [
      'They monitor their employees closely throughout the day',
      'They measure outcomes rather than hours and foster a culture of trust',
      'They eliminate communication tools to reduce distraction',
      'They require daily in-person meetings'
    ], answer: 1 },

  { passage: ENGLISH_PASSAGE_1, text: 'In the passage, the word "tightens" most nearly means:',
    options: [
      'becomes more competitive',
      'becomes more relaxed',
      'closes completely',
      'expands rapidly'
    ], answer: 0 },

  { passage: ENGLISH_PASSAGE_1, text: 'The tone of the passage can best be described as:',
    options: [
      'Sarcastic',
      'Indifferent',
      'Balanced and informative',
      'Humorous'
    ], answer: 2 },

  { text: 'Choose the option which is the closest SYNONYM of the word below.\nABANDON',
    options: ['Forsake', 'Retain', 'Convict', 'Assert'], answer: 0 },

  { text: 'Choose the option which is the closest SYNONYM of the word below.\nCOUNTERFEIT',
    options: ['Authentic', 'Fake', 'Honest', 'Visible'], answer: 1 },

  { text: 'Choose the option which is the closest SYNONYM of the word below.\nLUCID',
    options: ['Confusing', 'Clear', 'Opaque', 'Dense'], answer: 1 },

  { text: 'Choose the option which is the closest SYNONYM of the word below.\nPRUDENT',
    options: ['Reckless', 'Cautious', 'Wasteful', 'Loud'], answer: 1 },

  { text: 'Choose the option which is most OPPOSITE in meaning to the word below.\nFRUGAL',
    options: ['Economical', 'Extravagant', 'Thrifty', 'Miserly'], answer: 1 },

  { text: 'Choose the option which is most OPPOSITE in meaning to the word below.\nOBSOLETE',
    options: ['Outdated', 'Current', 'Antiquated', 'Disused'], answer: 1 },

  { text: 'Choose the option which is most OPPOSITE in meaning to the word below.\nSCARCITY',
    options: ['Shortage', 'Abundance', 'Deficit', 'Dearth'], answer: 1 },

  { text: 'Choose the option which is most OPPOSITE in meaning to the word below.\nHINDER',
    options: ['Impede', 'Facilitate', 'Obstruct', 'Thwart'], answer: 1 },

  { text: 'Fill in the blank with the correct option.\nThe manager insisted ____ reviewing the proposal before the deadline.',
    options: ['on', 'at', 'for', 'with'], answer: 0 },

  { text: 'Fill in the blank with the correct option.\nNeither of the two candidates ____ received the offer letter yet.',
    options: ['have', 'has', 'are', 'were'], answer: 1 },

  { text: 'Fill in the blank with the correct option.\nShe has been working here ____ 2019.',
    options: ['for', 'since', 'from', 'during'], answer: 1 },

  { text: 'Choose the option that best explains the idiom:\n"To bite the bullet"',
    options: [
      'To face a difficult situation courageously',
      'To speak angrily without thinking',
      'To waste precious resources',
      'To eat very quickly'
    ], answer: 0 },

  { text: 'Choose the grammatically correct sentence.',
    options: [
      'Each of the students have submitted their assignment.',
      'Each of the students has submitted his or her assignment.',
      'Each of the students have submitted its assignment.',
      'Each of the students has submitting their assignment.'
    ], answer: 1 }
];

/* ------------------------------------------------------------------
 * LOGICAL ABILITY (12 questions, 12 minutes)
 * ------------------------------------------------------------------ */
BANK.logical = [
  { text: 'Statements:\nAll pens are books.\nSome books are covers.\n\nConclusions:\nI. Some pens are covers.\nII. Some covers are books.\n\nWhich conclusion follows?',
    options: ['Only I follows', 'Only II follows', 'Both I and II follow', 'Neither I nor II follows'], answer: 1 },

  { text: 'Find the next term in the series:\n3, 7, 15, 31, 63, ?',
    options: ['95', '127', '111', '123'], answer: 1 },

  { text: 'In a certain code language, ROSE is written as 6821, CHAIR is written as 73456 and PREACH is written as 961473. What is the code for SEARCH?',
    options: ['246137', '214673', '214637', '216473'], answer: 1 },

  { text: 'Pointing to a photograph, a man said, "I have no brother or sister, but that man\u2019s father is my father\u2019s son." Whose photograph is it?',
    options: ['His son', 'His father', 'Himself', 'His nephew'], answer: 0 },

  { text: 'A man walks 5 km towards north, turns right and walks 3 km, then turns right again and walks 5 km. How far and in which direction is he from the starting point?',
    options: ['3 km east', '3 km west', '5 km north', '8 km east'], answer: 0 },

  { text: 'Which one does not belong to the group?\n121, 144, 169, 190, 225',
    options: ['121', '144', '190', '225'], answer: 2 },

  { text: 'Find the next term in the series:\n2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '46'], answer: 1 },

  { text: 'Five people A, B, C, D and E sit in a row facing north.\n- E is at the extreme left.\n- D sits second from the right.\n- A is to the immediate right of B.\n- C is not adjacent to E.\nWho sits in the middle of the row?',
    options: ['A', 'B', 'C', 'D'], answer: 0 },

  { text: 'Statements:\nSome cars are buses.\nAll buses are trucks.\n\nConclusions:\nI. Some cars are trucks.\nII. All trucks are buses.\n\nWhich conclusion follows?',
    options: ['Only I follows', 'Only II follows', 'Both I and II follow', 'Neither I nor II follows'], answer: 0 },

  { text: 'What is the angle between the hour hand and the minute hand of a clock at 3:30?',
    options: ['75\u00B0', '80\u00B0', '85\u00B0', '90\u00B0'], answer: 0 },

  { text: 'Find the missing term in the letter series:\nA, C, F, J, ?, U',
    options: ['M', 'N', 'O', 'P'], answer: 2 },

  { text: 'In a class, a student ranks 9th from the top and 32nd from the bottom. How many students are there in the class?',
    options: ['39', '40', '41', '42'], answer: 1 }
];

/* ------------------------------------------------------------------
 * QUANTITATIVE ABILITY - ADVANCED (16 questions, 16 minutes)
 * ------------------------------------------------------------------ */
BANK.quant = [
  { text: 'How many 4-digit numbers can be formed using the digits 1 to 7 without repetition of digits?',
    options: ['720', '840', '1024', '1296'], answer: 1 },

  { text: 'Two dice are thrown together. What is the probability that the sum of the numbers is 8?',
    options: ['1/6', '5/36', '1/9', '7/36'], answer: 1 },

  { text: 'If log\u2081\u20802 = 0.3010, how many digits does 2\u2075\u2070 have?',
    options: ['15', '16', '17', '18'], answer: 1 },

  { text: 'What is the sum of the first 20 terms of the arithmetic progression 3, 7, 11, 15, ...?',
    options: ['780', '800', '820', '840'], answer: 2 },

  { text: 'What is the sum to infinity of the geometric series 8 + 4 + 2 + 1 + ...?',
    options: ['12', '14', '16', '18'], answer: 2 },

  { text: 'What is the remainder when 7\u00B9\u2070\u2070 is divided by 11?',
    options: ['1', '7', '10', '5'], answer: 0 },

  { text: 'A train 150 m long crosses a pole in 15 seconds. What is the speed of the train in km/h?',
    options: ['30 km/h', '36 km/h', '40 km/h', '45 km/h'], answer: 1 },

  { text: 'The speed of a boat in still water is 10 km/h and the speed of the stream is 4 km/h. How long will the boat take to travel 28 km downstream and then return to the starting point?',
    options: ['5 hours 20 minutes', '6 hours 40 minutes', '7 hours', '7 hours 30 minutes'], answer: 1 },

  { text: 'Pipe A can fill a tank in 6 hours and pipe B can fill it in 9 hours. Working together, how long will they take to fill the tank?',
    options: ['3 hours 36 minutes', '3 hours 45 minutes', '4 hours', '4 hours 15 minutes'], answer: 0 },

  { text: 'An article costing Rs. 480 is sold at a profit of 15%. What is the selling price?',
    options: ['Rs. 522', 'Rs. 542', 'Rs. 552', 'Rs. 562'], answer: 2 },

  { text: 'The HCF of two numbers is 8 and their LCM is 48. If one number is 16, what is the other number?',
    options: ['20', '24', '28', '32'], answer: 1 },

  { text: 'The price of a commodity increases by 25%. By what percentage must a household reduce its consumption so that the expenditure remains the same?',
    options: ['16.67%', '20%', '25%', '30%'], answer: 1 },

  { text: 'If f(x) = 2x + 3 and g(x) = x\u00B2, what is the value of g(f(2))?',
    options: ['25', '36', '49', '64'], answer: 2 },

  { text: 'In how many distinct ways can the letters of the word LEVEL be arranged?',
    options: ['20', '30', '60', '120'], answer: 1 },

  { text: 'What is the sum of the roots of the equation 2x\u00B2 - 7x + 6 = 0?',
    options: ['3.5', '3', '6', '7'], answer: 0 },

  { text: 'A bag contains 4 red, 5 blue and 3 green balls. Two balls are drawn at random without replacement. What is the probability that both balls are red?',
    options: ['1/11', '1/9', '2/11', '1/6'], answer: 0 }
];

/* ------------------------------------------------------------------
 * PERSONALITY (72 questions, 15 minutes) - Likert scale
 * ------------------------------------------------------------------ */
const PERSONALITY_ITEMS = [
  'I am the life of the party.',
  'I don\u2019t talk a lot.',
  'I feel comfortable around people.',
  'I keep in the background.',
  'I start conversations.',
  'I have little to say.',
  'I talk to a lot of different people at parties.',
  'I don\u2019t like to draw attention to myself.',
  'I don\u2019t mind being the center of attention.',
  'I am quiet around strangers.',
  'I make friends easily.',
  'I warm up quickly to others.',
  'I am interested in people.',
  'I insult people.',
  'I sympathize with others\u2019 feelings.',
  'I am not interested in other people\u2019s problems.',
  'I have a soft heart.',
  'I am not really interested in others.',
  'I take time out for others.',
  'I feel other people\u2019s emotions.',
  'I make people feel at ease.',
  'I am hard to get along with.',
  'I am concerned about others.',
  'I trust what people say.',
  'I am always prepared.',
  'I leave my belongings around.',
  'I pay attention to details.',
  'I make a mess of things.',
  'I get chores done right away.',
  'I often forget to put things back in their proper place.',
  'I like order.',
  'I shirk my duties.',
  'I follow a schedule.',
  'I am exacting in my work.',
  'I finish tasks well before deadlines.',
  'I waste my time.',
  'I am relaxed most of the time.',
  'I get stressed out easily.',
  'I worry about things.',
  'I seldom feel blue.',
  'I am easily disturbed.',
  'I get upset easily.',
  'I change my mood a lot.',
  'I have frequent mood swings.',
  'I get irritated easily.',
  'I often feel blue.',
  'I feel calm and composed under pressure.',
  'I panic in stressful situations.',
  'I have a rich vocabulary.',
  'I have difficulty understanding abstract ideas.',
  'I have a vivid imagination.',
  'I am not interested in abstract ideas.',
  'I have excellent ideas.',
  'I do not have a good imagination.',
  'I am quick to understand things.',
  'I use difficult words.',
  'I spend time reflecting on things.',
  'I am full of ideas.',
  'I enjoy hearing new ideas.',
  'I prefer routine tasks over creative ones.',
  'I take charge of situations when needed.',
  'I like to work in teams rather than alone.',
  'I am comfortable making decisions under pressure.',
  'I adapt easily to changes in plans.',
  'I am punctual and value others\u2019 time.',
  'I believe honesty is always the best policy.',
  'I remain patient when others make mistakes.',
  'I am motivated by challenging goals.',
  'I keep my promises even when it is inconvenient.',
  'I strive to outperform my previous work.',
  'I listen carefully before responding in discussions.',
  'I handle criticism without getting defensive.'
];

BANK.personality = PERSONALITY_ITEMS.map(text => ({
  instruction: 'Choose the option that best describes you.',
  text: text,
  options: LIKERT_OPTIONS.slice(),
  likert: true,
  answer: -1
}));

/* ------------------------------------------------------------------
 * COMPUTER PROGRAMMING (25 questions, 35 minutes)
 * ------------------------------------------------------------------ */
BANK.programming = [
  { text: 'What is the output of the following C code?\n\nint a = 10;\nprintf("%d", a / 4);',
    options: ['2.5', '2', '3', 'Compilation error'], answer: 1 },

  { text: 'Which loop construct in C guarantees that its body executes at least once?',
    options: ['for', 'while', 'do-while', 'nested for'], answer: 2 },

  { text: 'On a typical 32-bit compiler, what is the size of int in bytes?',
    options: ['1', '2', '4', '8'], answer: 2 },

  { text: 'What is the worst-case time complexity of binary search on a sorted array of n elements?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1 },

  { text: 'Which data structure follows the Last-In-First-Out (LIFO) principle?',
    options: ['Queue', 'Stack', 'Linked list', 'Array'], answer: 1 },

  { text: 'What does the malloc() function return when it fails to allocate memory?',
    options: ['0', '-1', 'NULL', 'Garbage address'], answer: 2 },

  { text: 'What is the output of the following C code?\n\nfor (int i = 0; i < 5; i++) {\n    if (i == 2) continue;\n    printf("%d", i);\n}',
    options: ['01234', '0134', '0124', '1234'], answer: 1 },

  { text: 'Which of the following is NOT an object-oriented programming concept?',
    options: ['Encapsulation', 'Inheritance', 'Compilation', 'Polymorphism'], answer: 2 },

  { text: 'What is the default storage class of a local variable in C?',
    options: ['static', 'extern', 'register', 'auto'], answer: 3 },

  { text: 'Consider: int arr[5] = {1, 2, 3};  What is the value of arr[4]?',
    options: ['Garbage value', '0', '3', 'Compilation error'], answer: 1 },

  { text: 'A recursive function without a proper base case will most likely result in:',
    options: ['Compile-time error', 'Stack overflow at runtime', 'Infinite loop that never calls the function again', 'Automatic garbage collection'], answer: 1 },

  { text: 'Which operator is used to access a member of a structure through a pointer variable?',
    options: ['.', '->', '*', '&'], answer: 1 },

  { text: 'What is the output of the following C code?\n\nprintf("%d", 7 / 2);',
    options: ['3.5', '3', '4', 'Runtime error'], answer: 1 },

  { text: 'An optimized bubble sort algorithm that stops early when the array is already sorted has which best-case complexity?',
    options: ['O(n)', 'O(n log n)', 'O(n\u00B2)', 'O(log n)'], answer: 0 },

  { text: 'Which of the following is a valid C variable name?',
    options: ['2var', 'my-var', '_count', 'float'], answer: 2 },

  { text: 'What is the output of the following C code?\n\nint x = 5;\nint y = x++ + 5;\nprintf("%d %d", x, y);',
    options: ['5 10', '6 10', '6 11', '5 11'], answer: 1 },

  { text: 'Which standard library function releases dynamically allocated memory?',
    options: ['delete()', 'free()', 'release()', 'dealloc()'], answer: 1 },

  { text: 'A queue data structure follows which principle?',
    options: ['LIFO', 'FIFO', 'Random access', 'Priority ordering by default'], answer: 1 },

  { text: 'What is the output of the following C code?\n\nchar s[] = "hello";\nprintf("%c", s[1]);',
    options: ['h', 'e', 'l', 'o'], answer: 1 },

  { text: 'Which operator is the logical AND operator in C?',
    options: ['&', '&&', '|', '||'], answer: 1 },

  { text: 'What does sizeof(char) evaluate to in C?',
    options: ['0', '1', '2', '4'], answer: 1 },

  { text: 'Which of the following sorting algorithms is stable by default?',
    options: ['Quick sort', 'Heap sort', 'Merge sort', 'Selection sort'], answer: 2 },

  { text: 'A function that calls itself during its execution is called:',
    options: ['An inline function', 'A recursive function', 'A static function', 'A virtual function'], answer: 1 },

  { text: 'What is the output of the following C code?\n\nfor (int i = 10; i > 5; i -= 2)\n    printf("%d ", i);',
    options: ['10 8 6 4', '10 8 6', '10 8 6 4 2', '8 6 4'], answer: 1 },

  { text: 'Which header file must be included to use the printf() function in C?',
    options: ['stdlib.h', 'conio.h', 'string.h', 'stdio.h'], answer: 3 }
];

/* ------------------------------------------------------------------
 * COMPUTER SCIENCE (20 questions, 20 minutes)
 * ------------------------------------------------------------------ */
BANK.cs = [
  { text: 'Which of the given statements refers to data encapsulation in object oriented programming?',
    options: [
      'The data and operations for an object are defined and fixed.',
      'The data of an object is encapsulated in its class.',
      'The data is hidden for an object.',
      'A class can have multiple objects.'
    ], answer: 1 },

  { text: 'Which of the following is NOT an operating system?',
    options: ['Linux', 'Windows 10', 'Oracle', 'macOS'], answer: 2 },

  { text: 'Which normal form of a database removes transitive dependencies?',
    options: ['1NF', '2NF', '3NF', 'BCNF'], answer: 2 },

  { text: 'The TCP protocol operates at which layer of the OSI model?',
    options: ['Network layer', 'Transport layer', 'Session layer', 'Application layer'], answer: 1 },

  { text: 'Which of the following is NOT a necessary condition for a deadlock to occur?',
    options: ['Mutual exclusion', 'Hold and wait', 'Preemption', 'Circular wait'], answer: 2 },

  { text: 'Which of the following statements is TRUE about a primary key in a relational database?',
    options: [
      'It can contain duplicate values',
      'It must be unique and cannot be NULL',
      'It can be NULL multiple times',
      'It is always a numeric column'
    ], answer: 1 },

  { text: 'Which protocol is used to resolve a domain name into an IP address?',
    options: ['FTP', 'DHCP', 'DNS', 'SMTP'], answer: 2 },

  { text: 'Virtual memory is best described as:',
    options: [
      'A separate CPU cache memory',
      'A technique that allows execution of processes that are not completely in main memory',
      'A read-only firmware memory',
      'The registers inside the CPU'
    ], answer: 1 },

  { text: 'Which CPU scheduling algorithm can cause the problem of starvation of low-priority processes?',
    options: ['Round Robin', 'Priority scheduling', 'First-Come-First-Served', 'Time sharing'], answer: 1 },

  { text: 'B-trees are most commonly used in:',
    options: ['Network routing', 'Database indexing', 'Image compression', 'Compiler lexical analysis'], answer: 1 },

  { text: 'Which of the following is a CPU scheduling algorithm?',
    options: ['Round Robin', 'LRU', 'FIFO page replacement', 'Two-phase locking'], answer: 0 },

  { text: 'Inheritance in object-oriented programming primarily promotes:',
    options: ['Code reusability', 'Memory compaction', 'Compile-time polymorphism only', 'Encrypted storage'], answer: 0 },

  { text: 'Which SQL command removes a table along with its structure from the database?',
    options: ['DELETE', 'TRUNCATE', 'DROP', 'REMOVE'], answer: 2 },

  { text: 'HTTP is classified as which type of protocol?',
    options: ['Stateful', 'Stateless', 'Connection-oriented persistent by default', 'Binary-only'], answer: 1 },

  { text: 'A page fault occurs when:',
    options: [
      'A requested page is not found in main memory',
      'The disk becomes full',
      'A process terminates abnormally',
      'Two processes access the same file'
    ], answer: 0 },

  { text: 'Which data structure is used to implement Breadth-First Search (BFS) of a graph?',
    options: ['Stack', 'Queue', 'Priority queue', 'Hash table'], answer: 1 },

  { text: 'In DBMS, ACID properties stand for:',
    options: [
      'Atomicity, Consistency, Isolation, Durability',
      'Access, Consistency, Integration, Durability',
      'Atomicity, Concurrency, Isolation, Dependency',
      'Availability, Consistency, Integrity, Distribution'
    ], answer: 0 },

  { text: 'External fragmentation is a problem associated with:',
    options: ['Paged memory allocation', 'Contiguous memory allocation', 'Segmented paging', 'Virtual memory'], answer: 1 },

  { text: 'At which layer of the OSI model does routing of packets take place?',
    options: ['Data link layer', 'Network layer', 'Transport layer', 'Physical layer'], answer: 1 },

  { text: 'Using the same function name with different parameter lists is an example of:',
    options: ['Function overriding', 'Function overloading', 'Function hiding', 'Function wrapping'], answer: 1 }
];

/* ------------------------------------------------------------------
 * AUTOMATA PRO (2 questions, 60 minutes) - coding simulation
 * ------------------------------------------------------------------ */
const CODE_TEMPLATE_CPP =
`// Sample code to read input and write output:

/*
#include <iostream>

using namespace std;

int main()
{
    char name[20];
    cin >> name;                    // Read input from STDIN
    cout << "Hello " << name;       // Write output to STDOUT
    return 0;
}
*/

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail

#include <iostream>
using namespace std;
int main()
{
    // Write your code here
    return 0;
}
`;

const CODE_TEMPLATE_C =
`// Sample code to read input and write output:

/*
#include <stdio.h>

int main()
{
    char name[20];
    scanf("%s", name);              // Read input from STDIN
    printf("Hello %s", name);       // Write output to STDOUT
    return 0;
}
*/

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail

#include <stdio.h>
int main()
{
    // Write your code here
    return 0;
}
`;

const CODE_TEMPLATE_JAVA =
`// Sample code to read input and write output:

/*
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String name = in.next();                    // Read input from STDIN
        System.out.println("Hello " + name);        // Write output to STDOUT
    }
}
*/

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}
`;

const CODE_TEMPLATE_PY =
`# Sample code to read input and write output:

'''
name = input()                  # Read input from STDIN
print('Hello', name)            # Write output to STDOUT
'''

# Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail

def main():
    # Write your code here
    pass

if __name__ == '__main__':
    main()
`;

const LANGUAGES = [
  { id: 'cpp20',  label: 'C++ (20)',    template: CODE_TEMPLATE_CPP },
  { id: 'c99',    label: 'C (99)',      template: CODE_TEMPLATE_C },
  { id: 'java8',  label: 'Java (8)',    template: CODE_TEMPLATE_JAVA },
  { id: 'py3',    label: 'Python (3)',  template: CODE_TEMPLATE_PY }
];

BANK.automata = [
  {
    title: 'Alumni Dinner',
    intro: 'The current selected programming language is <b>C++20</b>. We emphasize the submission of a fully working code over partially correct but efficient code. Once <b>submitted</b>, you cannot review this problem again. You can use cout to debug your code. The cout may not work in case of syntax/runtime error. The version of GCC being used is <b>C++ 20</b>.',
    body: [
      'A university has invited N alumni for a dinner and the alumni registered themselves on the university website. The university has assigned each alumnus an invitation ID from 1 to N. Each alumnus likes exactly one fellow alumnus and will attend the dinner only if they can be seated next to that person at the round dining table.',
      'Write an algorithm for the university website to find the IDs of the alumni sorted in ascending order so that the maximum number of alumni attend the dinner. If there is more than one possible seating arrangement, then output the one that is smallest.'
    ],
    input: 'The first line of the input consists of an integer - num, representing the number of alumni (N).\nThe second line consists of N space-separated integers - alumniID[1], alumniID[2], ......., alumniID[N], representing the ID of the person whom the i\u1D57\u02B0 alumnus likes.',
    output: 'Print space-separated integers representing the IDs of the alumni who will attend the dinner.',
    note: 'One alumnus can be liked by multiple alumni.',
    constraints: '1 \u2264 num \u2264 10\u2075\n0 \u2264 i < num',
    example: { input: '4\n2 3 4 1', output: '1 2 3 4' },
    explanation: 'The first alumnus likes the person whose ID is 2.\nThe second alumnus likes the person whose ID is 3.\nThe third alumnus likes the person whose ID is 4.\nThe fourth alumnus likes the person whose ID is 1.\nA maximum of 4 alumni can be seated around the round table in the following manner:\n1\u21922\u21923\u21924\nTherefore the final output is: 1 2 3 4.',
    testCases: [
      { input: '4\n2 3 4 1', expected: '1 2 3 4', sample: true },
      { input: '5\n2 3 1 5 4', expected: '3 4 5', sample: false },
      { input: '6\n2 3 4 5 6 1', expected: '1 2 3 4 5 6', sample: false }
    ]
  },
  {
    title: 'Best Trading Period',
    intro: 'The current selected programming language is <b>C++20</b>. We emphasize the submission of a fully working code over partially correct but efficient code. Once <b>submitted</b>, you cannot review this problem again. You can use cout to debug your code. The cout may not work in case of syntax/runtime error. The version of GCC being used is <b>C++ 20</b>.',
    body: [
      'A stock trader maintains a record of the daily change in the price of a particular stock for N consecutive days. The trader wants to highlight the best contiguous period in an investor report.',
      'Write an algorithm to find the maximum total change that can be achieved over any contiguous period of days.'
    ],
    input: 'The first line of the input consists of an integer - num, representing the number of days (N).\nThe second line consists of N space-separated integers - change[1], change[2], ......., change[N], representing the change in stock price on each day.',
    output: 'Print an integer representing the maximum total change over any contiguous period of days.',
    note: 'The period must contain at least one day.',
    constraints: '1 \u2264 num \u2264 10\u2075\n-10\u2074 \u2264 change[i] \u2264 10\u2074',
    example: { input: '8\n-2 1 -3 4 -1 2 1 -5', output: '6' },
    explanation: 'The maximum total change is obtained over the period of days 4 to 7 (values 4, -1, 2, 1), giving 4 + (-1) + 2 + 1 = 6.\nTherefore the final output is: 6.',
    testCases: [
      { input: '8\n-2 1 -3 4 -1 2 1 -5', expected: '6', sample: true },
      { input: '5\n1 2 3 4 5', expected: '15', sample: false },
      { input: '4\n-1 -2 -3 -4', expected: '-1', sample: false }
    ]
  }
];

/* ------------------------------------------------------------------
 * AUTOMATA FIX (7 questions, 20 minutes) - fix the buggy code
 * ------------------------------------------------------------------ */
BANK.autofix = [
  {
    title: 'Reverse the number',
    text: 'The function reverseNumber() accepts an integer num and should return the number obtained by reversing its digits. The code compiles but does not produce the expected output. Find and fix the logical error in the code.',
    language: 'c',
    code:
`int reverseNumber(int num)
{
    int rev = 0;
    while (num > 0)
    {
        rev = rev * 10 + num / 10;
        num = num / 10;
    }
    return rev;
}`,
    testCases: [
      { input: '123', expected: '321', sample: true },
      { input: '4500', expected: '54', sample: false }
    ],
    sim: {
      isFixed: function (code) { return /rev\s*=\s*rev\s*\*\s*10\s*\+\s*num\s*%\s*10/.test(code); },
      run: function (input, fixed) {
        const n = parseInt(input.trim().split(/\s+/)[0], 10);
        let rev = 0, t = n;
        if (fixed) { while (t > 0) { rev = rev * 10 + (t % 10); t = Math.floor(t / 10); } }
        else { while (t > 0) { rev = rev * 10 + Math.floor(t / 10); t = Math.floor(t / 10); } }
        return String(rev);
      }
    }
  },
  {
    title: 'Prime check',
    text: 'The function isPrime() accepts a positive integer num and should return 1 if num is a prime number and 0 otherwise. Find and fix the errors in the code.',
    language: 'c',
    code:
`int isPrime(int num)
{
    int i;
    if (num < 2)
        return 1;
    for (i = 2; i < num; i++)
    {
        if (num % i == 0)
            return 1;
    }
    return 0;
}`,
    testCases: [
      { input: '7', expected: '1', sample: true },
      { input: '9', expected: '0', sample: false }
    ],
    sim: {
      isFixed: function (code) { return /num\s*<\s*2\s*\)\s*\{?\s*return\s*0/.test(code); },
      run: function (input, fixed) {
        const n = parseInt(input.trim().split(/\s+/)[0], 10);
        if (!fixed) {
          if (n < 2) return '1';
          for (let i = 2; i < n; i++) { if (n % i === 0) return '1'; }
          return '0';
        }
        if (n < 2) return '0';
        for (let i = 2; i < n; i++) { if (n % i === 0) return '0'; }
        return '1';
      }
    }
  },
  {
    title: 'Largest element',
    text: 'The function findLargest() accepts an integer array arr and its size n, and should return the largest element of the array. It gives a wrong answer for some inputs. Find and fix the logical error.',
    language: 'c',
    code:
`int findLargest(int arr[], int n)
{
    int i, max = arr[0];
    for (i = 0; i < n - 1; i++)
    {
        if (arr[i] > max)
            max = arr[i];
    }
    return max;
}`,
    testCases: [
      { input: '5\n3 9 1 7 12', expected: '12', sample: true },
      { input: '4\n2 -7 -3 9', expected: '9', sample: false }
    ],
    sim: {
      isFixed: function (code) { return /for\s*\(\s*i\s*=\s*0\s*;\s*i\s*<\s*n\s*;/.test(code); },
      run: function (input, fixed) {
        const nums = input.trim().split(/\s+/).map(Number);
        const n = nums[0], arr = nums.slice(1, 1 + n);
        let max = arr[0];
        const limit = fixed ? n : n - 1;   /* the bug skips the last element */
        for (let i = 0; i < limit; i++) { if (arr[i] > max) max = arr[i]; }
        return String(max);
      }
    }
  },
  {
    title: 'Binary search',
    text: 'The function binarySearch() accepts a sorted array arr of size n and a key, and should return the index of key in arr, or -1 if key is not present. The search returns wrong indices. Find and fix the error.',
    language: 'c',
    code:
`int binarySearch(int arr[], int n, int key)
{
    int low = 0, high = n - 1, mid;
    while (low <= high)
    {
        mid = (low + high) / 2;
        if (arr[mid] == key)
            return mid;
        else if (arr[mid] < key)
            high = mid - 1;
        else
            low = mid + 1;
    }
    return -1;
}`,
    testCases: [
      { input: '5\n2 4 6 8 10\n8', expected: '3', sample: true },
      { input: '5\n2 4 6 8 10\n5', expected: '-1', sample: false }
    ],
    sim: {
      isFixed: function (code) {
        const hasLowAfterLess = /arr\s*\[\s*mid\s*\]\s*<\s*key[\s\S]{0,30}low\s*=\s*mid\s*\+\s*1/.test(code);
        const hasBuggyBranch = /arr\s*\[\s*mid\s*\]\s*<\s*key[\s\S]{0,30}high\s*=\s*mid\s*-\s*1/.test(code);
        return hasLowAfterLess && !hasBuggyBranch;
      },
      run: function (input, fixed) {
        const nums = input.trim().split(/\s+/).map(Number);
        const n = nums[0], arr = nums.slice(1, 1 + n), key = nums[1 + n];
        let low = 0, high = n - 1;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          if (arr[mid] === key) return String(mid);
          if (fixed) { if (arr[mid] < key) low = mid + 1; else high = mid - 1; }
          else { if (arr[mid] < key) high = mid - 1; else low = mid + 1; }
        }
        return '-1';
      }
    }
  },
  {
    title: 'Palindrome string',
    text: 'The function isPalindrome() accepts a string str and should return 1 if str is a palindrome and 0 otherwise. It currently returns 0 for every input. Find and fix the error.',
    language: 'c',
    code:
`int isPalindrome(char str[])
{
    int i = 0;
    int j = strlen(str);
    while (i < j)
    {
        if (str[i] != str[j])
            return 0;
        i++;
        j--;
    }
    return 1;
}`,
    testCases: [
      { input: 'madam', expected: '1', sample: true },
      { input: 'hello', expected: '0', sample: false }
    ],
    sim: {
      isFixed: function (code) { return /strlen\s*\(\s*str\s*\)\s*-\s*1/.test(code); },
      run: function (input, fixed) {
        const s = input.trim();
        let i = 0;
        let j = fixed ? s.length - 1 : s.length;   /* the bug compares the '\0' */
        while (i < j) { if (s[i] !== s[j]) return '0'; i++; j--; }
        return '1';
      }
    }
  },
  {
    title: 'Factorial',
    text: 'The function factorial() accepts an integer num (num >= 0) and should return the factorial of num. The program crashes for every input. Find and fix the error.',
    language: 'c',
    code:
`int factorial(int num)
{
    if (num == 0)
        return 1;
    return num * factorial(num);
}`,
    testCases: [
      { input: '5', expected: '120', sample: true },
      { input: '0', expected: '1', sample: false }
    ],
    sim: {
      isFixed: function (code) { return /factorial\s*\(\s*num\s*-\s*1\s*\)/.test(code); },
      run: function (input, fixed) {
        const n = parseInt(input.trim(), 10);
        if (!fixed) return 'RUNTIME ERROR (stack overflow)';   /* infinite recursion */
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        return String(f);
      }
    }
  },
  {
    title: 'Swap two numbers',
    text: 'The function swap() accepts two integers and should exchange their values in the caller. After the call, the values remain unchanged. Find and fix the error.',
    language: 'c',
    code:
`void swap(int a, int b)
{
    int temp = a;
    a = b;
    b = temp;
}`,
    testCases: [
      { input: '3 8', expected: '8 3', sample: true },
      { input: '-1 12', expected: '12 -1', sample: false }
    ],
    sim: {
      isFixed: function (code) { return /int\s*\*\s*a\s*,\s*int\s*\*\s*b/.test(code); },
      run: function (input, fixed) {
        const nums = input.trim().split(/\s+/).map(Number);
        if (!fixed) return nums.join(' ');        /* call by value: nothing changes */
        return nums[1] + ' ' + nums[0];
      }
    }
  }
];

/* Expose */
window.SECTIONS = SECTIONS;
window.BANK = BANK;
window.LANGUAGES = LANGUAGES;
window.LIKERT_OPTIONS = LIKERT_OPTIONS;
