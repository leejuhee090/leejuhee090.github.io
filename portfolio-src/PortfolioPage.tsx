import React, { useEffect, useMemo, useState } from "react";
import "./styles/portfolio.scss";

type TrackType = "퍼블리싱" | "React" | "Vue";
type FilterType = "ALL" | TrackType;

interface ProjectItem {
  id: string;
  title: string;
  client: string;
  period: string;
  mode: string;
  track: TrackType;
  role: string;
  summary: string;
  stack: string[];
  point: string;
  codeExample: string;
}

// 와이어플로 리뷰 결과를 페이지 안에서 바로 보여 줍니다.
// portfolio-src/public/design/ 에 있는 파일이 빌드 결과(dist/design/)로 함께 복사됩니다.
const WIREFLOW_SRC = "./design/portfolio-redesign.html";

const CLIENTS = [
  "삼성",
  "현대카드",
  "키움증권",
  "현대 글로비스",
  "농협",
  "GS리테일",
  "아모레퍼시픽",
  "올리브영",
  "코스맥스",
  "국민연금공단",
  "고려해운",
];

const PROJECTS: ProjectItem[] = [
  {
    id: "nh-groupware",
    title: "NH농협 그룹웨어 포털 구축",
    client: "농협",
    period: "2026.07 ~ 2026.12",
    mode: "React",
    track: "React",
    role: "React 화면 퍼블리싱",
    summary:
      "그룹웨어 메인, 결재, 게시판, 위젯 편집 화면을 React 컴포넌트 구조로 옮기고 표와 팝업, 드래그 정렬을 재사용 가능한 형태로 정리했습니다.",
    stack: ["React 18", "TypeScript", "Vite", "SCSS", "ag-Grid"],
    point: "크기나 색을 화면마다 직접 적지 않고 prop 조합으로만 쓰게 컴포넌트 단위를 정리했습니다.",
    codeExample: `.ui-btn {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 6px;\n}`,
  },
  {
    id: "kiwoom-mts",
    title: "키움증권 퇴직연금 구축 (MTS)",
    client: "키움증권",
    period: "2025.10 ~ 2026.03",
    mode: "모바일 공동 작업",
    track: "퍼블리싱",
    role: "MTS 화면 퍼블리싱",
    summary:
      "퇴직연금 신청과 연금 조회 화면을 모바일 웹앱으로 퍼블리싱하고, 운영 CSS와 최대한 어긋나지 않도록 공통 CSS를 새로 작업했습니다.",
    stack: ["MXML", "JavaScript", "CSS"],
    point: "기존 공통 소스를 먼저 파악한 뒤 신규 화면 공통 CSS를 맞춰 기존 운영 스타일 충돌을 줄였습니다.",
    codeExample: `// 화면 단위 스코프와 공통 토큰 분리\n.mts-pension .card-box { padding: 16px; }`,
  },
  {
    id: "bio-bigdata",
    title: "국가통합바이오빅데이터 구축사업단",
    client: "보건복지부·질병관리청",
    period: "2025.04 ~ 2025.09",
    mode: "Vue 설정",
    track: "Vue",
    role: "HTML 퍼블리싱, Vue 프로젝트 구성",
    summary:
      "관리자포털, 참여자포털, 시스템관리자 화면을 퍼블리싱하고 Vue 프로젝트를 설정했습니다.",
    stack: ["HTML", "SCSS", "JavaScript", "Vue 3", "Vite"],
    point: "다중 포털 구조에서 공통 마크업/SCSS 규칙을 잡고 화면 단위로 분리했습니다.",
    codeExample: `// Vue 3 + Vite 화면 모듈 기준\nexport interface PortalProps { title: string; }`,
  },
  {
    id: "gs-retail",
    title: "GS리테일 구축",
    client: "GS리테일",
    period: "2024.02 ~ 2024.06",
    mode: "공동 작업",
    track: "Vue",
    role: "Vue 화면 퍼블리싱",
    summary: "Vue 환경에서 컬럼 정의, 조건부 스타일링, 셀 렌더러 설정을 담당했습니다.",
    stack: ["Vue", "Grid", "SCSS"],
    point: "그리드 조건부 스타일링과 셀 렌더러 규칙을 명확히 분리해 유지보수성을 높였습니다.",
    codeExample: `const cellStyle = (val: string) => (val === "완료" ? "is-done" : "is-pending");`,
  },
];

export const PortfolioPage: React.FC = () => {
  const [dark, setDark] = useState(false);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [selectedId, setSelectedId] = useState<string>(PROJECTS[0].id);

  // BaseButton 테스트 상태
  const [variant, setVariant] = useState<"contained" | "outlined" | "text">("contained");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const visibleProjects = useMemo(() => {
    if (filter === "ALL") return PROJECTS;
    return PROJECTS.filter((item) => item.track === filter);
  }, [filter]);

  const currentDetail = useMemo(
    () => PROJECTS.find((item) => item.id === selectedId) ?? PROJECTS[0],
    [selectedId]
  );

  return (
    <div className="p-page">
      {/* 상단 고정 헤더 */}
      <header className="p-header">
        <div className="l-container p-header__inner">
          <a href="#top" className="p-header__brand">이주희</a>
          <nav className="p-header__nav">
            <a href="#career">경력</a>
            <a href="#process">작업 방식</a>
            <a href="#projects">프로젝트</a>
            <a href="#wireflow">와이어플로</a>
            <a href="#components">공통 컴포넌트</a>
            <a href="#detail">상세</a>
          </nav>
          <div className="p-header__actions">
            <button
              type="button"
              className="p-filter-btn"
              onClick={() => setDark((prev) => !prev)}
            >
              {dark ? "라이트 전환" : "다크 전환"}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="l-container p-hero">
          <div className="p-hero__lead">React 18 · TypeScript · Vite · SCSS</div>
          <h1 className="p-hero__title">이주희 · 퍼블리셔 · 8년차</h1>
          <p className="p-hero__summary">
            공공기관, 대기업 이커머스, 금융, 증권, SI에서 운영·구축 퍼블리싱을 해왔습니다.
            Vue.js 기반 관리자 페이지 데이터 바인딩 및 동적 UI 구현 경험이 있으며,
            현재 Cursor·Codex·Claude 등을 활용한 모바일 앱 출시도 준비 중입니다.
          </p>
          <div className="p-hero__meta-row">
            <div className="p-hero__clients">
              {CLIENTS.map((client) => (
                <span key={client} className="p-chip">{client}</span>
              ))}
            </div>
            <div className="p-hero__links">
              <a href="mailto:leejuhee090@gmail.com">leejuhee090@gmail.com</a>
              <a href="https://github.com/leejuhee090" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
        </section>

        {/* 01. 경력 */}
        <section id="career" className="l-section">
          <div className="l-container">
            <div className="l-section__head">
              <div>
                <div className="l-section__eyebrow">01 / CAREER</div>
                <h2 className="l-section__title">2017년부터 23개 프로젝트</h2>
                <p className="l-section__desc">단독 작업 13건 · 공동 작업 10건</p>
              </div>
            </div>
            <div className="l-grid-4">
              <div className="p-stat-card">
                <div className="p-stat-card__num">8년</div>
                <div className="p-stat-card__label">퍼블리싱 경력</div>
                <div className="p-stat-card__sub">2017.12 ~</div>
              </div>
              <div className="p-stat-card">
                <div className="p-stat-card__num">23건</div>
                <div className="p-stat-card__label">참여 프로젝트</div>
                <div className="p-stat-card__sub">커머스 8 · 공공 6 · 기타 4</div>
              </div>
              <div className="p-stat-card">
                <div className="p-stat-card__num">5건</div>
                <div className="p-stat-card__label">Vue · React 작업</div>
                <div className="p-stat-card__sub">금융 3 · 내부전산 2</div>
              </div>
              <div className="p-stat-card">
                <div className="p-stat-card__num">2회</div>
                <div className="p-stat-card__label">웹접근성 취득</div>
                <div className="p-stat-card__sub">마크업 단계 준수</div>
              </div>
            </div>
          </div>
        </section>

        {/* 02. 작업 방식 */}
        <section id="process" className="l-section">
          <div className="l-container">
            <div className="l-section__head">
              <div>
                <div className="l-section__eyebrow">02 / PROCESS</div>
                <h2 className="l-section__title">운영 소스와 협업 화면 작업 순서</h2>
              </div>
            </div>
            <div className="l-grid-4">
              <article className="p-step-card">
                <span className="p-step-card__idx">STEP 01</span>
                <h3 className="p-step-card__title">기존 소스 먼저</h3>
                <p className="p-step-card__desc">있는 공통부터 찾고 운영 CSS와 어긋나지 않게 작업합니다.</p>
                <div className="p-step-card__note">키움 · 운영 CSS 유지</div>
              </article>
              <article className="p-step-card">
                <span className="p-step-card__idx">STEP 02</span>
                <h3 className="p-step-card__title">규칙부터 합의</h3>
                <p className="p-step-card__desc">공통 UI와 클래스 네이밍, 마크업 규칙을 먼저 정합니다.</p>
                <div className="p-step-card__note">현대카드 · 퍼블리셔 3인</div>
              </article>
              <article className="p-step-card">
                <span className="p-step-card__idx">STEP 03</span>
                <h3 className="p-step-card__title">검토와 백업</h3>
                <p className="p-step-card__desc">산출물을 검토하고 다중 수정 시 백업을 남깁니다.</p>
                <div className="p-step-card__note">올리브영 · 커밋 충돌 방지</div>
              </article>
              <article className="p-step-card">
                <span className="p-step-card__idx">STEP 04</span>
                <h3 className="p-step-card__title">인계와 접근성</h3>
                <p className="p-step-card__desc">데이터 바인딩 자리를 남기고 웹접근성을 맞춥니다.</p>
                <div className="p-step-card__note">웹접근성 취득 2회</div>
              </article>
            </div>
          </div>
        </section>

        {/* 03. 프로젝트 */}
        <section id="projects" className="l-section">
          <div className="l-container">
            <div className="l-section__head">
              <div>
                <div className="l-section__eyebrow">03 / PROJECTS</div>
                <h2 className="l-section__title">프로젝트 아카이브</h2>
                <p className="l-section__desc">카드를 누르면 아래 상세 영역에서 내용을 확인할 수 있습니다.</p>
              </div>
              <div className="p-filter-bar">
                {(["ALL", "퍼블리싱", "React", "Vue"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`p-filter-btn ${filter === tab ? "is-active" : ""}`}
                    onClick={() => setFilter(tab)}
                  >
                    {tab === "ALL" ? "전체" : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="l-grid-2">
              {visibleProjects.map((project) => (
                <article
                  key={project.id}
                  className={`p-project-card ${project.id === currentDetail.id ? "is-selected" : ""}`}
                  onClick={() => {
                    setSelectedId(project.id);
                    document.getElementById("detail")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <div>
                    <div className="p-project-card__top">
                      <span>{project.client} · {project.period}</span>
                      <span className="p-project-card__badge">{project.track}</span>
                    </div>
                    <h3 className="p-project-card__title">{project.title}</h3>
                    <div className="p-project-card__role">{project.role} · {project.mode}</div>
                    <p className="p-project-card__desc">{project.summary}</p>
                    <div className="p-project-card__tags">
                      {project.stack.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-project-card__foot">
                    <span>{project.mode}</span>
                    <span className="p-project-card__cta">상세보기 →</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 04. 와이어플로 (새 메뉴) */}
        <section id="wireflow" className="l-section">
          <div className="l-container">
            <div className="l-section__head">
              <div>
                <div className="l-section__eyebrow">04 / WIREFLOW</div>
                <h2 className="l-section__title">포트폴리오 제작 과정 · 화면 흐름</h2>
                <p className="l-section__desc">
                  메인 → 프로젝트 → 상세 흐름을 와이어플로로 검토한 결과입니다. 아래 화면에서 바로 눌러 볼 수 있습니다.
                </p>
              </div>
            </div>
            <div className="p-wireflow">
              <iframe
                className="p-wireflow__frame"
                src={WIREFLOW_SRC}
                title="포트폴리오 메인·상세 와이어플로"
                loading="lazy"
              />
              <div className="p-wireflow__foot">
                <span>wireflow-review 스킬 적용 결과</span>
                <a className="p-wireflow__open" href={WIREFLOW_SRC} target="_blank" rel="noreferrer">
                  새 탭에서 열기 ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 05. 공통 컴포넌트 */}
        <section id="components" className="l-section">
          <div className="l-container">
            <div className="l-section__head">
              <div>
                <div className="l-section__eyebrow">05 / COMMON COMPONENTS</div>
                <h2 className="l-section__title">prop으로만 쓰게 만든 공통 UI</h2>
                <p className="l-section__desc">화면에서 크기나 색을 임의로 지정하지 않고 prop 조합으로 제어합니다.</p>
              </div>
            </div>

            <div className="p-playground">
              <div className="p-playground__controls">
                <div className="p-playground__row">
                  <span className="p-playground__label">variant</span>
                  {(["contained", "outlined", "text"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`p-filter-btn ${variant === v ? "is-active" : ""}`}
                      onClick={() => setVariant(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div className="p-playground__row">
                  <span className="p-playground__label">size</span>
                  {(["sm", "md", "lg"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`p-filter-btn ${size === s ? "is-active" : ""}`}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-playground__preview">
                <button type="button" className={`ui-btn ui-btn--${variant} ui-btn--${size}`}>
                  BaseButton 미리보기
                </button>
                <code>{`variant="${variant}" size="${size}"`}</code>
              </div>
            </div>
          </div>
        </section>

        {/* 상세 영역 */}
        <section id="detail" className="l-section">
          <div className="l-container">
            <div className="l-section__head">
              <div>
                <div className="l-section__eyebrow">PROJECT DETAIL</div>
                <h2 className="l-section__title">선택한 프로젝트 상세</h2>
              </div>
            </div>

            <div className="l-detail-layout">
              <aside className="p-detail-aside">
                <div className="l-section__eyebrow">{currentDetail.track}</div>
                <h3 className="p-detail-aside__title">{currentDetail.title}</h3>
                <p className="p-detail-aside__summary">{currentDetail.summary}</p>
                <dl className="p-detail-aside__dl">
                  <div>
                    <dt>고객사</dt>
                    <dd>{currentDetail.client}</dd>
                  </div>
                  <div>
                    <dt>기간</dt>
                    <dd>{currentDetail.period}</dd>
                  </div>
                  <div>
                    <dt>담당</dt>
                    <dd>{currentDetail.role}</dd>
                  </div>
                </dl>
                <div className="p-project-card__tags">
                  {currentDetail.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </aside>

              <div className="p-detail-body">
                <div className="p-detail-block">
                  <h3>작업 포인트</h3>
                  <p>{currentDetail.point}</p>
                </div>
                <div className="p-detail-block">
                  <h3>스타일 / 코드 기준</h3>
                  <pre className="p-code-box">
                    <code>{currentDetail.codeExample}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PortfolioPage;
