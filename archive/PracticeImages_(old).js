import PracticeImage from "./PracticeImage"

export default function PracticeImages({ projects }) {
    return (
        <section className="practice-images">
            {projects.map((p,i) => (
                <PracticeImage key={i} practice={p} i={i}/>
            ))}
        </section>
    )
}