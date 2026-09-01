import { TechnicalDomainId, TechnicalDomainInfo, TechnicalQuestion } from '../src/types';

export const TECHNICAL_DOMAINS_LIST: TechnicalDomainInfo[] = [
  {
    id: 'fullstack',
    name: 'Full Stack Development',
    category: 'Software Engineering',
    description: 'End-to-end web architectures, React/Next.js, Node.js, REST & GraphQL APIs, microservices, and state management.',
    topics: ['React Reconciliation', 'Node.js Event Loop', 'REST & GraphQL', 'State Management', 'Fullstack Security', 'Caching & Redis'],
    icon: 'Layers',
  },
  {
    id: 'genai',
    name: 'Generative AI & LLM Engineering',
    category: 'AI & Machine Learning',
    description: 'Transformer architectures, self-attention, RAG pipelines, vector databases, LoRA fine-tuning, prompt engineering, and agentic workflows.',
    topics: ['Self-Attention & Transformer Math', 'Retrieval-Augmented Generation (RAG)', 'Vector Databases & Similarity Search', 'LoRA & Parameter-Efficient Fine-Tuning', 'Hallucination Mitigation', 'Agent Tool Calling & ReAct Loops'],
    icon: 'Sparkles',
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps Engineering',
    category: 'Cloud & Infrastructure',
    description: 'AWS/GCP/Azure architectures, Kubernetes orchestration, Docker, CI/CD automation pipelines, Infrastructure as Code (Terraform), and SRE.',
    topics: ['Docker & Containerization', 'Kubernetes Pods & Ingress', 'CI/CD Pipelines & GitHub Actions', 'Infrastructure as Code (Terraform)', 'Cloud VPC & Networking', 'Prometheus & SRE Observability'],
    icon: 'Cloud',
  },
  {
    id: 'datascience',
    name: 'Data Science & Machine Learning',
    category: 'Data & Analytics',
    description: 'Exploratory data analysis, statistical modeling, hypothesis testing, feature engineering, tree ensembles, and predictive MLOps pipelines.',
    topics: ['Pandas & NumPy Pipelines', 'Hypothesis Testing (p-values)', 'Feature Engineering & Imputation', 'Tree Ensembles (XGBoost/LightGBM)', 'Deep Neural Networks', 'Model Drift & Monitoring'],
    icon: 'BarChart2',
  },
  {
    id: 'cybersecurity',
    name: 'Cyber Security & Zero Trust',
    category: 'Security & Infrastructure',
    description: 'Threat modeling, OWASP Top 10 mitigation, Zero Trust architectures, cryptographic protocols (RSA/ECC), mTLS, and IAM policies.',
    topics: ['OWASP Top 10 (SQLi/XSS/CSRF)', 'Zero Trust Architecture', 'Public Key Cryptography (RSA/ECC)', 'mTLS & Network Security', 'Identity & Access (IAM)', 'Incident Response'],
    icon: 'ShieldCheck',
  },
];

// Curated comprehensive questions per domain for Level 1, 2, and 3
export const TECHNICAL_QUESTION_BANK: Record<TechnicalDomainId, TechnicalQuestion[]> = {
  fullstack: [
    // Level 1 — Basic (10 Questions)
    {
      question_id: 'fs_l1_q1',
      domain: 'fullstack',
      level: 1,
      level_name: 'Level 1 — Basic',
      topic: 'HTML & DOM Basics',
      difficulty: 'Easy',
      type: 'conceptual',
      question: 'What is the Document Object Model (DOM), and how does a web browser parse and construct the DOM tree from HTML markup?',
      expected_key_points: ['Hierarchical tree representation of HTML elements', 'Tokenization and HTML parser steps', 'Render tree formation with CSSOM', 'JavaScript accessibility via DOM APIs'],
      improved_answer: 'The Document Object Model (DOM) is an in-memory tree representation of the structured HTML document. As the browser receives raw HTML bytes, it decodes them to characters, tokenizes elements, converts tokens into node objects, and builds the DOM tree. Combined with the CSSOM, the browser creates the Render Tree to layout and paint pixels on the screen.',
    },
    {
      question_id: 'fs_l1_q2',
      domain: 'fullstack',
      level: 1,
      level_name: 'Level 1 — Basic',
      topic: 'HTTP Methods',
      difficulty: 'Easy',
      type: 'conceptual',
      question: 'Explain the fundamental differences between HTTP GET, POST, PUT, and DELETE methods. Which of them are idempotent?',
      expected_key_points: ['GET retrieves resources without side-effects (safe & idempotent)', 'POST creates new child resources (non-idempotent)', 'PUT creates or completely replaces an existing resource (idempotent)', 'DELETE removes the target resource (idempotent)'],
      improved_answer: 'HTTP GET is a safe and idempotent method used purely to read resources. POST submits data to create a new resource and is not idempotent because repeating it creates duplicates. PUT replaces the target entity entirely and is idempotent. DELETE removes the resource; calling DELETE multiple times yields the same final system state, making it idempotent.',
    },
    {
      question_id: 'fs_l1_q3',
      domain: 'fullstack',
      level: 1,
      level_name: 'Level 1 — Basic',
      topic: 'JavaScript Variables & Scope',
      difficulty: 'Easy',
      type: 'conceptual',
      question: 'What are the main scope and mutability differences between var, let, and const in JavaScript?',
      expected_key_points: ['var is function-scoped and hoisted with undefined', 'let and const are block-scoped with Temporal Dead Zone (TDZ)', 'const prevents variable re-assignment but object properties remain mutable'],
      improved_answer: 'var is function-scoped, can be re-declared, and is hoisted with an initial value of undefined. In contrast, let and const introduced in ES6 are block-scoped ({...}) and reside in the Temporal Dead Zone until initialized. const creates an immutable identifier binding, though nested object/array mutations are still allowed unless frozen.',
    },
    {
      question_id: 'fs_l1_q4',
      domain: 'fullstack',
      level: 1,
      level_name: 'Level 1 — Basic',
      topic: 'React Core Concepts',
      difficulty: 'Easy',
      type: 'conceptual',
      question: 'What are React props and state, and what is the rule of one-way data binding in React?',
      expected_key_points: ['Props are read-only inputs passed from parent to child', 'State is internal mutable component memory managed via useState/reducers', 'Data flows downwards via props; events flow upwards via callback functions'],
      improved_answer: 'In React, props are immutable parameters passed down from a parent component to configure a child. State represents internal, reactive data maintained by the component itself. React enforces unidirectional (one-way) data flow: data moves down via props, while state changes are signaled upwards via callbacks, creating predictable state management.',
    },
    {
      question_id: 'fs_l1_q5',
      domain: 'fullstack',
      level: 1,
      level_name: 'Level 1 — Basic',
      topic: 'CSS Box Model',
      difficulty: 'Easy',
      type: 'conceptual',
      question: 'Describe the CSS Box Model layers (content, padding, border, margin) and the difference between content-box and border-box.',
      expected_key_points: ['Content area, inner padding, boundary border, external margin', 'content-box: width/height only applies to content', 'border-box: width/height includes padding and border, making sizing predictable'],
      improved_answer: 'The CSS Box Model comprises four concentric layers: Content (text/media), Padding (inner space), Border (boundary line), and Margin (outer clearance). With box-sizing: content-box, width applies solely to the content, adding padding and borders to the total size. With border-box, specified width encapsulates content, padding, and borders, preventing layout overflow.',
    },
    {
      question_id: 'fs_l1_q6',
      domain: 'fullstack',
      level: 1,
      level_name: 'Level 1 — Basic',
      topic: 'Node.js Basics',
      difficulty: 'Easy',
      type: 'conceptual',
      question: 'What is Node.js, and how does its single-threaded non-blocking I/O model operate using the event loop?',
      expected_key_points: ['JavaScript runtime built on V8', 'Single main thread for execution', 'Libuv thread pool handles asynchronous background I/O', 'Event loop processes callbacks from task queues'],
      improved_answer: 'Node.js is an asynchronous, event-driven JavaScript runtime engine built on Google Chrome V8. While user JavaScript runs on a single main execution thread, Node.js offloads non-blocking asynchronous system tasks (such as network calls and disk operations) to the OS kernel or Libuv worker thread pool, invoking callbacks on the main thread via the Event Loop.',
    },
    {
      question_id: 'fs_l1_q7',
      domain: 'fullstack',
      level: 1,
      level_name: 'Level 1 — Basic',
      topic: 'REST API Status Codes',
      difficulty: 'Easy',
      type: 'conceptual',
      question: 'Explain what HTTP status code categories 2xx, 3xx, 4xx, and 5xx represent, giving common examples for each.',
      expected_key_points: ['2xx: Success (200 OK, 201 Created)', '3xx: Redirection (301 Moved Permanently, 304 Not Modified)', '4xx: Client Error (400 Bad Request, 401 Unauthorized, 404 Not Found)', '5xx: Server Error (500 Internal Error, 502 Bad Gateway, 503 Unavailable)'],
      improved_answer: 'HTTP status codes communicate response outcomes: 2xx denotes success (e.g., 200 OK, 201 Created); 3xx indicates redirection (e.g., 301 Permanent Redirect, 304 Not Modified); 4xx signals client-side errors (e.g., 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found); and 5xx indicates server-side failures (e.g., 500 Internal Server Error, 503 Service Unavailable).',
    },
    {
      question_id: 'fs_l1_q8',
      domain: 'fullstack',
      level: 1,
      level_name: 'Level 1 — Basic',
      topic: 'JSON & Serialization',
      difficulty: 'Easy',
      type: 'conceptual',
      question: 'What is JSON, and how do JSON.stringify() and JSON.parse() work in full-stack data exchange?',
      expected_key_points: ['Lightweight text-based data interchange format', 'JSON.stringify serializes JS objects to JSON strings', 'JSON.parse deserializes JSON strings into JS objects', 'Handles primitives, arrays, and nested objects'],
      improved_answer: 'JSON (JavaScript Object Notation) is a standardized, language-agnostic text format for transmitting structured data. JSON.stringify() serializes in-memory JavaScript objects into a formatted text string for HTTP network payloads, while JSON.parse() parses received strings back into native JavaScript objects.',
    },
    {
      question_id: 'fs_l1_q9',
      domain: 'fullstack',
      level: 1,
      level_name: 'Level 1 — Basic',
      topic: 'Cookies vs LocalStorage',
      difficulty: 'Easy',
      type: 'conceptual',
      question: 'Compare Browser LocalStorage, SessionStorage, and Cookies in terms of capacity, lifecycle, and network transmission.',
      expected_key_points: ['LocalStorage: ~5-10MB, persists across sessions, client-only', 'SessionStorage: ~5MB, cleared when tab closes, client-only', 'Cookies: ~4KB, sent automatically in HTTP headers, supports HttpOnly/Secure flags'],
      improved_answer: 'LocalStorage provides 5-10MB of persistent key-value storage that remains until explicitly cleared and is never automatically sent with HTTP requests. SessionStorage is isolated to the active browser tab. Cookies have a 4KB limit, are sent automatically with every HTTP request matching their domain/path, and can be protected with HttpOnly and SameSite flags for secure session management.',
    },
    {
      question_id: 'fs_l1_q10',
      domain: 'fullstack',
      level: 1,
      level_name: 'Level 1 — Basic',
      topic: 'Git Version Control',
      difficulty: 'Easy',
      type: 'conceptual',
      question: 'What is the purpose of Git version control, and what is the difference between git merge and git rebase?',
      expected_key_points: ['Distributed version control system for tracking source changes', 'git merge preserves true chronological commit history with a merge commit', 'git rebase replays feature commits on top of base branch to create a linear history'],
      improved_answer: 'Git is a distributed version control system for tracking code changes and facilitating team collaboration. git merge combines two branches by creating a distinct merge commit that preserves the original branch topology. In contrast, git rebase moves or replays the entire feature branch onto the tip of the target branch, producing a clean, linear commit history.',
    },

    // Level 2 — Intermediate (10 Questions)
    {
      question_id: 'fs_l2_q1',
      domain: 'fullstack',
      level: 2,
      level_name: 'Level 2 — Intermediate',
      topic: 'React Reconciliation & Virtual DOM',
      difficulty: 'Medium',
      type: 'conceptual',
      question: 'Explain how the React Reconciliation algorithm and the Virtual DOM diffing mechanism achieve efficient UI updates. Why are unique keys required for list items?',
      expected_key_points: ['Virtual DOM in-memory representation diffed using heuristic O(n) algorithm', 'Fiber architecture enables interruptible work units', 'Component keys allow React to track element identity across renders avoiding full recreation'],
      improved_answer: 'React creates a lightweight in-memory Virtual DOM tree. When state changes, it generates a new tree and applies a heuristic O(n) diffing algorithm comparing element types and props. If element types match, it updates only mutated attributes. Keys provide stable identity across renders, allowing React to match children between trees and perform minimal re-ordering instead of tearing down and recreating DOM nodes.',
    },
    {
      question_id: 'fs_l2_q2',
      domain: 'fullstack',
      level: 2,
      level_name: 'Level 2 — Intermediate',
      topic: 'JavaScript Event Loop & Microtasks',
      difficulty: 'Medium',
      type: 'code_output',
      question: 'Analyze the following JavaScript snippet and explain the exact console output order step-by-step.',
      code_snippet_display: `console.log('1 - Start');

setTimeout(() => {
  console.log('2 - Timeout Callback');
}, 0);

Promise.resolve().then(() => {
  console.log('3 - Microtask Promise 1');
}).then(() => {
  console.log('4 - Microtask Promise 2');
});

console.log('5 - End');`,
      expected_key_points: ['Synchronous code runs first (1, 5)', 'Microtask queue (Promises) processed immediately before Macrotasks (3, 4)', 'Macrotask queue (setTimeout) executes last (2)'],
      improved_answer: 'Output order: "1 - Start", "5 - End", "3 - Microtask Promise 1", "4 - Microtask Promise 2", "2 - Timeout Callback". Synchronous statements execute immediately on the call stack. When the stack clears, the Event Loop flushes the high-priority Microtask Queue (all resolved Promise handlers) before processing Macrotasks (setTimeout timer callbacks).',
    },
    {
      question_id: 'fs_l2_q3',
      domain: 'fullstack',
      level: 2,
      level_name: 'Level 2 — Intermediate',
      topic: 'JWT Authentication & Security',
      difficulty: 'Medium',
      type: 'conceptual',
      question: 'Compare storing JSON Web Tokens (JWTs) in Browser LocalStorage vs HttpOnly SameSite Cookies. How do you prevent XSS and CSRF attacks in modern SPAs?',
      expected_key_points: ['LocalStorage is vulnerable to Cross-Site Scripting (XSS) token exfiltration', 'HttpOnly cookies cannot be accessed via JavaScript, preventing XSS theft', 'SameSite=Strict/Lax and CSRF anti-forgery tokens prevent Cross-Site Request Forgery'],
      improved_answer: 'Storing JWTs in LocalStorage exposes them to any malicious XSS script running on the page. Storing auth tokens in HttpOnly, Secure, SameSite=Strict cookies completely blocks JavaScript access, eliminating XSS token theft. To protect cookie-based endpoints from CSRF, we pair SameSite cookies with custom CSRF header validation or short-lived in-memory access tokens refreshed via secure cookies.',
    },
    {
      question_id: 'fs_l2_q4',
      domain: 'fullstack',
      level: 2,
      level_name: 'Level 2 — Intermediate',
      topic: 'Database Indexing & N+1 Problem',
      difficulty: 'Medium',
      type: 'conceptual',
      question: 'What is the N+1 query problem in Object-Relational Mapping (ORM), and how do you resolve it using Eager Loading or JOINs?',
      expected_key_points: ['Executing 1 initial query to fetch N records, then N subsequent queries for each child relationship', 'Generates N+1 round-trips to database causing latency spikes', 'Solved using SQL JOINs or ORM eager loading (e.g. Prisma include, TypeORM relations, Sequelize eager)'],
      improved_answer: 'The N+1 problem occurs when an ORM issues one query to fetch parent rows, followed by N separate queries for each parent record to retrieve its related child records. This saturates database connections and introduces severe network latency. It is resolved by eager loading child entities using SQL INNER/LEFT JOINs or an IN (...) subquery in a single batched database round-trip.',
    },
    {
      question_id: 'fs_l2_q5',
      domain: 'fullstack',
      level: 2,
      level_name: 'Level 2 — Intermediate',
      topic: 'React Hooks & Stale Closures',
      difficulty: 'Medium',
      type: 'debugging',
      question: 'Identify the stale closure bug in this React counter hook and explain how to fix it.',
      code_snippet_display: `function useIntervalCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Bug here:
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []); // Empty dependency array captures initial count=0 forever

  return count;
}`,
      expected_key_points: ['count inside setInterval callback captures initial value 0 due to stale closure', 'Fix 1: Use functional state updater setCount(prev => prev + 1)', 'Fix 2: Add count to dependency array or use a custom useInterval ref pattern'],
      improved_answer: 'Because the useEffect dependency array is empty [], the setInterval callback forms a closure over the initial render scope where count is 0. On every second tick, it computes setCount(0 + 1), locking the counter at 1. The optimal fix is using the functional state updater form: setCount(prev => prev + 1), which accesses the most up-to-date state without recreating interval timers.',
    },
    {
      question_id: 'fs_l2_q6',
      domain: 'fullstack',
      level: 2,
      level_name: 'Level 2 — Intermediate',
      topic: 'CORS & Preflight Requests',
      difficulty: 'Medium',
      type: 'conceptual',
      question: 'What is Cross-Origin Resource Sharing (CORS)? Under what conditions does the browser initiate an HTTP OPTIONS preflight request?',
      expected_key_points: ['Browser security mechanism enforcing Same-Origin Policy', 'Preflight OPTIONS sent for non-simple requests', 'Triggers: custom headers (Authorization), methods other than GET/HEAD/POST, or content-types like application/json', 'Server responds with Access-Control-Allow-Origin / Methods / Headers'],
      improved_answer: 'CORS is a browser security mechanism that restricts web applications from making cross-origin requests to a domain different from the host. When a request uses non-simple HTTP methods (PUT, DELETE, PATCH), custom request headers (Authorization, X-Custom), or Content-Type application/json, the browser automatically sends an HTTP OPTIONS preflight request to verify server permissions before sending the actual payload.',
    },
    {
      question_id: 'fs_l2_q7',
      domain: 'fullstack',
      level: 2,
      level_name: 'Level 2 — Intermediate',
      topic: 'REST vs GraphQL',
      difficulty: 'Medium',
      type: 'conceptual',
      question: 'Compare REST APIs and GraphQL. In what engineering scenarios would you choose GraphQL over REST or vice versa?',
      expected_key_points: ['REST: Multiple specialized endpoints, prone to over-fetching or under-fetching', 'GraphQL: Single endpoint, client requests exact fields in a typed schema', 'REST advantages: native HTTP caching (ETags/CDN), simplicity', 'GraphQL advantages: flexible client queries, mobile bandwidth optimization'],
      improved_answer: 'REST organizes resources around fixed URLs and HTTP verbs, leveraging native CDN and HTTP caching, but can suffer from over-fetching or under-fetching that requires multiple round-trips. GraphQL exposes a single strongly-typed schema endpoint where clients query the exact shape of data required, eliminating round-trips. REST is preferable for simple caching-heavy APIs, while GraphQL excels in complex, multi-client, data-dense applications.',
    },
    {
      question_id: 'fs_l2_q8',
      domain: 'fullstack',
      level: 2,
      level_name: 'Level 2 — Intermediate',
      topic: 'Node.js Streams & Memory Buffer',
      difficulty: 'Medium',
      type: 'conceptual',
      question: 'Why are Node.js Streams essential when processing large files (e.g. 5GB upload or CSV exports), and how does backpressure prevent process crashes?',
      expected_key_points: ['Streams process data chunk-by-chunk in small chunks (e.g. 64KB) rather than buffering the entire 5GB in RAM', 'Backpressure pauses the readable stream when the writable stream buffer is full', 'Prevents heap out-of-memory errors and optimizes throughput'],
      improved_answer: 'Reading a 5GB file with fs.readFile attempts to load the entire byte payload into Node.js V8 memory buffer, causing immediate process crashes from heap exhaustion. Streams process data in continuous small chunks (e.g., 64KB). Backpressure occurs when the consumer (writable stream) is slower than the producer (readable stream); the stream signals to pause reading until buffers drain, ensuring memory usage stays constant regardless of file size.',
    },
    {
      question_id: 'fs_l2_q9',
      domain: 'fullstack',
      level: 2,
      level_name: 'Level 2 — Intermediate',
      topic: 'WebSockets vs Server-Sent Events',
      difficulty: 'Medium',
      type: 'conceptual',
      question: 'Compare WebSockets, Server-Sent Events (SSE), and Long Polling for real-time full-stack communications.',
      expected_key_points: ['WebSockets: Full-duplex bidirectional TCP communication (chat, multiplayer, live canvas)', 'SSE: Unidirectional server-to-client streaming over HTTP/2 (live feeds, stock tickers, AI response streaming)', 'Long Polling: Repeated HTTP request loop with latency and connection overhead'],
      improved_answer: 'WebSockets establish a persistent, full-duplex TCP connection permitting real-time bidirectional messaging between client and server, optimal for collaborative tools, gaming, and chats. Server-Sent Events (SSE) offer a lightweight, unidirectional server-to-client stream over standard HTTP with automatic reconnection, ideal for LLM streaming responses and live dashboards. Long polling repeatedly opens HTTP requests, generating excessive overhead.',
    },
    {
      question_id: 'fs_l2_q10',
      domain: 'fullstack',
      level: 2,
      level_name: 'Level 2 — Intermediate',
      topic: 'Frontend Performance & Core Web Vitals',
      difficulty: 'Medium',
      type: 'conceptual',
      question: 'Explain the three primary Core Web Vitals metrics: LCP, INP (or FID), and CLS. How do you optimize them in a modern web app?',
      expected_key_points: ['LCP (Largest Contentful Paint): loading performance; optimize images, CDN, SSR', 'INP (Interaction to Next Paint): interactivity; reduce JS main-thread blocking, code-split', 'CLS (Cumulative Layout Shift): visual stability; reserve aspect ratios, avoid dynamic element insertion above fold'],
      improved_answer: 'Core Web Vitals quantify real-world user experience: Largest Contentful Paint (LCP) measures perceived loading speed (target < 2.5s), optimized via image compression, CDN caching, and server-side rendering; Interaction to Next Paint (INP) measures responsiveness to user clicks/keys (target < 200ms), improved by offloading CPU-heavy tasks to Web Workers and reducing long tasks; and Cumulative Layout Shift (CLS) measures layout stability (target < 0.1), fixed by reserving dimensional bounding boxes for media and font fallbacks.',
    },

    // Level 3 — Practical / Coding / Problem Solving (10 Questions)
    {
      question_id: 'fs_l3_q1',
      domain: 'fullstack',
      level: 3,
      level_name: 'Level 3 — Practical',
      topic: 'Custom Debounce Implementation',
      difficulty: 'Hard',
      type: 'coding',
      language: 'typescript',
      question: 'Implement a fully typed debounce utility in TypeScript that cancels previous pending invocations and forwards arguments correctly to the target function.',
      code_template: `function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    // Implement debounce logic here
  };
}`,
      expected_key_points: ['Preserve closure timer variable', 'Clear existing timer with clearTimeout', 'Schedule new timer with setTimeout forwarding args', 'Maintain correct execution context'],
      improved_answer: `function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>): void {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delayMs);
  };
}`,
    },
    {
      question_id: 'fs_l3_q2',
      domain: 'fullstack',
      level: 3,
      level_name: 'Level 3 — Practical',
      topic: 'High-Traffic API Caching & Invalidation',
      difficulty: 'Hard',
      type: 'scenario',
      question: 'Design an end-to-end multi-tier caching architecture for an e-commerce flash sale system handling 100,000 requests per second. Detail browser caching, CDN edge caching, Redis distributed caching, and cache invalidation strategies (e.g. Cache-Aside, Write-Through, Stale-While-Revalidate).',
      expected_key_points: ['Multi-tier: Browser Cache-Control -> Edge CDN (Cloudflare) -> API Gateway -> Distributed Redis Cache -> SQL Database', 'Cache-Aside with TTL & Pub/Sub event-driven cache purging on inventory updates', 'Thundering herd mitigation via mutex locking or probabilistic early expiration', 'Stale-While-Revalidate for non-blocking sub-millisecond edge responses'],
      improved_answer: 'To handle 100k RPS: 1) Static assets and product listings are cached at Edge CDNs with Cache-Control: public, max-age=60, stale-while-revalidate=300. 2) The Node API layer implements a Cache-Aside pattern against a Redis Cluster with replication. 3) For inventory stock, we use Redis atomic decrement (DECRBY) with Lua scripts to prevent overselling. 4) Cache stampedes (thundering herds) are mitigated with single-flight mutexes (like dogpiling locks). 5) When catalog data changes, the admin service publishes a Redis Pub/Sub invalidation event to purge edge and L1 memory caches.',
    },
    {
      question_id: 'fs_l3_q3',
      domain: 'fullstack',
      level: 3,
      level_name: 'Level 3 — Practical',
      topic: 'Express Rate Limiter Middleware',
      difficulty: 'Hard',
      type: 'coding',
      language: 'typescript',
      question: 'Write an Express middleware function for in-memory sliding window or token bucket rate limiting that limits clients to a maximum of N requests per window duration.',
      code_template: `interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

export function createRateLimiter(options: RateLimitOptions) {
  const requestHistory = new Map<string, number[]>();

  return (req: any, res: any, next: any) => {
    // Implement IP-based sliding window rate limiter
  };
}`,
      expected_key_points: ['Extract client IP identifier', 'Filter timestamps older than now - windowMs', 'Check if remaining timestamps exceed maxRequests', 'Reject with 429 Too Many Requests and Retry-After header or call next()'],
      improved_answer: `export function createRateLimiter(options: RateLimitOptions) {
  const requestHistory = new Map<string, number[]>();

  return (req: any, res: any, next: any) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - options.windowMs;

    const timestamps = (requestHistory.get(ip) || []).filter((ts) => ts > windowStart);

    if (timestamps.length >= options.maxRequests) {
      const oldest = timestamps[0];
      const retryAfterSeconds = Math.ceil((oldest + options.windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        error: 'Too Many Requests',
        message: \`Rate limit exceeded. Please retry in \${retryAfterSeconds} seconds.\`,
      });
    }

    timestamps.push(now);
    requestHistory.set(ip, timestamps);
    next();
  };
}`,
    },
    {
      question_id: 'fs_l3_q4',
      domain: 'fullstack',
      level: 3,
      level_name: 'Level 3 — Practical',
      topic: 'Live Debugging: Memory Leak in Node.js',
      difficulty: 'Hard',
      type: 'debugging',
      question: 'Examine this Express server code snippet. Explain why the server runs out of memory over time, and provide the corrected code.',
      code_snippet_display: `const express = require('express');
const app = express();
const globalEventHub = new (require('events').EventEmitter)();

// Memory leak bug in route handler:
app.get('/api/live-status', (req, res) => {
  const onStatusUpdate = (data) => {
    res.write(JSON.stringify(data));
  };

  globalEventHub.on('status', onStatusUpdate);

  req.on('close', () => {
    // Missing listener removal!
    res.end();
  });
});`,
      expected_key_points: ['Each incoming HTTP connection attaches a new listener to the long-lived globalEventHub', 'When the request closes, the listener reference is not removed, preventing garbage collection of req and res objects', 'Fix: call globalEventHub.removeListener("status", onStatusUpdate) on req close event'],
      improved_answer: 'Because globalEventHub is a persistent singleton, attaching globalEventHub.on("status", onStatusUpdate) on every HTTP request without detaching it on connection close creates an uncollected reference closure holding the req and res objects in RAM indefinitely. The fix is: req.on("close", () => { globalEventHub.removeListener("status", onStatusUpdate); res.end(); });.',
    },
    {
      question_id: 'fs_l3_q5',
      domain: 'fullstack',
      level: 3,
      level_name: 'Level 3 — Practical',
      topic: 'Distributed Order Processing & Sagas',
      difficulty: 'Hard',
      type: 'scenario',
      question: 'In a microservices architecture with separate Payment, Inventory, and Shipping services, how do you handle distributed transactions when payment succeeds but inventory reservation fails? Explain the Saga Pattern with compensating transactions.',
      expected_key_points: ['Two-Phase Commit (2PC) creates blocking dependencies and poor scalability in microservices', 'Saga pattern organizes local transactions with event/message orchestration', 'Compensating transactions execute backwards (e.g. Refund Payment) if a downstream step fails', 'Idempotency keys and dead-letter queues guarantee eventual consistency'],
      improved_answer: 'In microservices, traditional distributed 2PC locks resources and degrades availability. The Saga Pattern breaks the distributed transaction into a sequence of local transactions coordinated via an Orchestrator or Choreography (Kafka events). If the Inventory service fails after Payment succeeds, the orchestrator triggers compensating transactions (e.g., executing a Payment Refund and notifying the user), restoring system state and ensuring eventual consistency with idempotency keys.',
    },
    {
      question_id: 'fs_l3_q6',
      domain: 'fullstack',
      level: 3,
      level_name: 'Level 3 — Practical',
      topic: 'Concurrency & Deep Cloning Algorithm',
      difficulty: 'Hard',
      type: 'coding',
      language: 'typescript',
      question: 'Implement a robust deep clone function in JavaScript/TypeScript that handles nested objects, arrays, Dates, RegExps, and circular references using a WeakMap.',
      code_template: `function deepClone<T>(obj: T, hash = new WeakMap()): T {
  // Implement deep clone with circular reference protection
  return obj;
}`,
      expected_key_points: ['Handle primitives and null directly', 'WeakMap tracks visited object references to prevent infinite circular recursion', 'Handle Date (new Date(obj)) and RegExp (new RegExp(obj)) objects', 'Recursively clone Object keys and Array elements'],
      improved_answer: `function deepClone<T>(obj: T, hash = new WeakMap()): T {
  if (Object(obj) !== obj) return obj; // Primitives & functions
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags) as any;
  if (hash.has(obj as object)) return hash.get(obj as object);

  const result: any = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  hash.set(obj as object, result);

  for (const key of Reflect.ownKeys(obj as object)) {
    result[key] = deepClone((obj as any)[key], hash);
  }

  return result;
}`,
    },
    {
      question_id: 'fs_l3_q7',
      domain: 'fullstack',
      level: 3,
      level_name: 'Level 3 — Practical',
      topic: 'Fullstack Security Audit & Hardening',
      difficulty: 'Hard',
      type: 'scenario',
      question: 'Conduct a security audit of a web application handling user file uploads. What security vulnerabilities (e.g. Remote Code Execution, Zip Slips, SSRF, DoS) can arise and how do you architect a safe upload pipeline using S3 Presigned URLs?',
      expected_key_points: ['Direct file uploads to application server risk RCE via malicious scripts and disk fill DoS', 'Presigned S3/GCS URLs allow clients to upload directly to object storage bypassing backend memory', 'Enforce strict MIME validation, randomized UUID keys, malware scanning (ClamAV), and Content-Disposition headers'],
      improved_answer: 'Uploading files directly through application servers introduces RCE (executing uploaded .php/.js files), SSRF, Zip Bombs, and memory exhaustion. The secure architecture uses Direct-to-S3 Presigned URLs: 1) Client requests an upload token; 2) Backend validates auth, limits file size, and generates an Amazon S3 PUT Presigned URL with an isolated UUID key; 3) Client uploads directly to S3; 4) An asynchronous Lambda/Worker scans the file with antivirus and validates magic bytes before marking it active.',
    },
    {
      question_id: 'fs_l3_q8',
      domain: 'fullstack',
      level: 3,
      level_name: 'Level 3 — Practical',
      topic: 'Custom React Promise Hook (useAsync)',
      difficulty: 'Hard',
      type: 'coding',
      language: 'typescript',
      question: 'Implement a reusable React custom hook `useAsync` that manages loading, error, data state, and aborts in-flight requests when the component unmounts.',
      code_template: `import { useState, useEffect } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>(asyncFn: (signal: AbortSignal) => Promise<T>, deps: any[] = []) {
  // Implement state and effect with AbortController
}`,
      expected_key_points: ['Manage data, loading, error state', 'Instantiate new AbortController in useEffect', 'Pass controller.signal to asyncFn', 'Handle AbortError gracefully', 'Abort in cleanup function on unmount'],
      improved_answer: `export function useAsync<T>(asyncFn: (signal: AbortSignal) => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    asyncFn(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setState({ data: null, loading: false, error });
        }
      });

    return () => {
      controller.abort();
    };
  }, deps);

  return state;
}`,
    },
    {
      question_id: 'fs_l3_q9',
      domain: 'fullstack',
      level: 3,
      level_name: 'Level 3 — Practical',
      topic: 'Database Deadlocks & Concurrency',
      difficulty: 'Hard',
      type: 'scenario',
      question: 'In an SQL database managing user account balances, how do concurrent transfers between Account A and Account B cause deadlocks? How do you prevent deadlocks using consistent lock ordering or Optimistic Concurrency Control (OCC)?',
      expected_key_points: ['Deadlock occurs when Transaction 1 locks A and waits for B, while Transaction 2 locks B and waits for A', 'Solution 1: Enforce deterministic resource locking order (e.g. always lock lower account_id first)', 'Solution 2: Optimistic concurrency control using version columns (UPDATE ... WHERE version = current_version)'],
      improved_answer: 'A classic deadlock happens when Tx1 updates Account 10 then Account 20 (locking 10 and waiting for 20), while Tx2 simultaneously updates Account 20 then Account 10 (locking 20 and waiting for 10). We eliminate deadlocks by: 1) Deterministic Lock Ordering: always acquire row locks in strict ascending order of ID (min(id1, id2) then max(id1, id2)) using SELECT FOR UPDATE; or 2) Optimistic Concurrency Control: verify version numbers on commit and retry transient failures.',
    },
    {
      question_id: 'fs_l3_q10',
      domain: 'fullstack',
      level: 3,
      level_name: 'Level 3 — Practical',
      topic: 'Zero-Downtime Deployment & Database Migration',
      difficulty: 'Hard',
      type: 'scenario',
      question: 'Explain how to execute a database schema change (such as renaming a column or splitting a table) in a high-volume production system without incurring any downtime. Describe the Expand and Contract pattern.',
      expected_key_points: ['Never perform destructive schema changes (e.g. DROP/RENAME) in a single step with live traffic', 'Phase 1 (Expand): Add new column, dual-write to old and new columns in app code', 'Phase 2 (Backfill): Background worker migrates historical records', 'Phase 3 (Contract): Switch reads to new column, stop writes to old column, finally drop old column'],
      improved_answer: 'To perform zero-downtime schema changes, we use the Expand and Contract (Parallel Run) pattern: 1) Expand: Add the new column (nullable/default) to the database. 2) Dual-Write: Deploy code that writes to both old and new columns while still reading from the old. 3) Backfill: Run asynchronous worker jobs to migrate historical data in batches. 4) Switch Reads: Deploy code to read exclusively from the new column. 5) Contract: Safely drop the old column and remove legacy dual-write code.',
    },
  ],

  // Fallback defaults for remaining domains (structured dynamically with curated templates)
  genai: [],
  cloud: [],
  datascience: [],
  cybersecurity: [],
};
