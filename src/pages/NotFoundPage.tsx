import { Link } from "react-router-dom";
import { Page } from "../components/layout/Page";
import { Container } from "../components/common/primitives";

export default function NotFoundPage() {
  return (
    <Page>
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow eyebrow--plain justify-center">Signal fault · 404</p>
        <h1 className="mt-6 font-display text-[clamp(3rem,10vw,7rem)] font-bold leading-none tracking-tight">
          STATION
          <br />
          NOT FOUND
        </h1>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">
          The line you're looking for doesn't stop here — it may have been diverted,
          renamed, or it only existed in an earlier draft of the map.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn btn--primary">
            ← Back to home
          </Link>
          <Link to="/journey" className="btn btn--outline">
            Open the journey map
          </Link>
        </div>
      </Container>
    </Page>
  );
}
