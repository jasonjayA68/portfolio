/** The glowing aurora blobs and faint grid lines behind every page. Pure CSS, no JavaScript. */
export function Background() {
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="bg-lines" aria-hidden="true" />
    </>
  )
}
