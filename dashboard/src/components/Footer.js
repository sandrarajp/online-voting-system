import React from "react"

export default function Footer() {
    return (
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top mb-0 mt-0">
            <div className="col-md-4 d-flex align-items-center ms-5">
                <span className="mb-3 mb-md-0 text-muted d-flex flex-column">
                    Copyright © 2022 Poller
                    <span>Made by Michael Ikoko</span>
                </span>
            </div>

            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex me-5 ms-4">
                <li className="ms-3 border-end border-secondary pe-3">
                    <a className="text-muted" href="https://twitter.com/michael_ikoko?ref_src=twsrc%5Etfw" target="_blank">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="footer-icon"
                        >
                            <path d="M21.634 4.031c-.815.385-2.202 1.107-2.899 1.245-.027.007-.049.016-.075.023A4.5 4.5 0 0011 8.5c0 .131-.011.372 0 .5-3.218 0-5.568-1.679-7.327-3.837-.235-.29-.485-.139-.537.067-.117.466-.157 1.245-.157 1.801 0 1.401 1.095 2.777 2.8 3.63-.314.081-.66.139-1.02.139a2.97 2.97 0 01-1.339-.335c-.158-.083-.499-.06-.398.344.405 1.619 2.253 2.756 3.904 3.087-.375.221-1.175.176-1.543.176-.136 0-.609-.032-.915-.07-.279-.034-.708.038-.349.582.771 1.167 2.515 1.9 4.016 1.928-1.382 1.084-3.642 1.48-5.807 1.48-.438-.01-.416.489-.063.674C3.862 19.504 6.478 20 8.347 20 15.777 20 20 14.337 20 8.999l-.005-.447c0-.018.005-.035.005-.053 0-.027-.008-.053-.008-.08a18.384 18.384 0 00-.009-.329c.589-.425 1.491-1.163 1.947-1.728.155-.192.03-.425-.181-.352-.543.189-1.482.555-2.07.625 1.177-.779 1.759-1.457 2.259-2.21.171-.257-.043-.518-.304-.394z"></path>
                        </svg>
                    </a>
                </li>

                <li class="ms-3 border-end border-secondary pe-3">
                    <a class="text-muted" href="https://github.com/michaelikoko?tab=repositories" target="_blank">
                        <svg viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6 fill-slate-900 footer-icon">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z">
                            </path>
                        </svg>
                    </a>
                </li>

                <li className="ms-3 ">
                    <a className="text-muted" href="mailto:michaelikoko.o@gmail.com">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="256"
                            height="256"
                            viewBox="0 0 256 256"
                            className="footer-icon"
                        >
                            <g fill="#000" strokeMiterlimit="10" strokeWidth="1">
                                <path
                                    d="M45 51.648l45-27.845v-6.422a2.887 2.887 0 00-2.887-2.887H2.887A2.887 2.887 0 000 17.381v6.422l45 27.845z"
                                    transform="matrix(2.81 0 0 2.81 1.407 1.407)"
                                ></path>
                                <path
                                    d="M45.789 54.688c-.011.007-.023.008-.033.015a1.46 1.46 0 01-.253.111c-.04.014-.077.035-.118.046a1.494 1.494 0 01-.353.048c-.011 0-.021.004-.031.004H45h-.001c-.011 0-.021-.004-.031-.004a1.555 1.555 0 01-.353-.048c-.04-.011-.078-.032-.118-.046a1.494 1.494 0 01-.253-.111c-.011-.006-.023-.008-.033-.015L0 27.331V72.62a2.888 2.888 0 002.887 2.887h84.226A2.888 2.888 0 0090 72.62V27.331L45.789 54.688z"
                                    transform="matrix(2.81 0 0 2.81 1.407 1.407)"
                                ></path>
                            </g>
                        </svg>
                    </a>
                </li>
            </ul>
        </footer>
    )
}