import './App.css';
import { useEffect, useState } from 'react';
import Measure from 'react-measure';
import { Routes, Route, HashRouter, Navigate, NavLink } from "react-router-dom";

const summary = [
  {
    title: 'Convertir export lore selfie en cartes à découper',
    slug: 'ls-history-to-cards',
    component: () => <div>à faire</div>
  },
  {
    title: 'Convertir export lore selfie en fichier de réseau',
    slug: 'ls-history-to-gexf',
    component: () => <div>à faire</div>
  },
  {
    title: 'Screenshots youtube',
    slug: 'screenshots-youtube',
    component: () => <div>à faire</div>
  },
  {
    title: 'Sous-titres youtube',
    slug: 'subs-youtube',
    component: () => <div>à faire</div>
  },
  {
    title: 'Portrait de mon usage d\'une vidéo',
    slug: 'video-biography',
    component: () => <div>à faire</div>
  },
  {
    title: 'Résultat recherche youtube vers carte',
    slug: 'youtube-search-to-cards',
    component: () => <div>à faire</div>
  },
  {
    title: 'Récupérer les commentaires youtube d\'une vidéo',
    slug: 'youtube-comments',
    component: () => <div>à faire</div>
  },
  {
    title: 'Résultats de recherche vers cartes',
    slug: 'search-engine-cards',
    component: () => <div>à faire</div>
  },
  {
    title: 'Convertir liste tiktok de zeechwimer en items exploitables',
    slug: 'zeechwimer-tiktok',
    component: () => <div>à faire</div>
  },
]

function App() {
  const [dimensions, setDimensions] = useState();
  return (
    <HashRouter>
      <Measure
        bounds
        onResize={contentRect => {
          setDimensions(contentRect.bounds);
        }}
      >
        {({ measureRef }) => (
          <div className="App" ref={measureRef}>
            <header>
              <h1>
                Habiter les internets (track zone du lore) - outils
              </h1>
            </header>
            <main>
              <nav>
                <ul>
                  {
                    summary.map(({ slug, title }) => {
                      return (
                        <li key={slug}>
                          <NavLink to={`/${slug}`}>
                            {title}
                          </NavLink>
                        </li>
                      )

                    })
                  }
                </ul>
              </nav>
              <section>
                <Routes>
                  {
                    summary.map(({ slug, title, component }) => {
                      return (
                        <Route key={slug} path={`/${slug}`}
                          Component={() => component()}
                        />
                      )
                    })
                  }
                  <Route
                    key='404'
                    path="*"
                    element={<Navigate to="/" />}
                  />
                </Routes>
              </section>
            </main>
          </div>
        )
        }
      </Measure>
    </HashRouter>
  );
}

export default App;
