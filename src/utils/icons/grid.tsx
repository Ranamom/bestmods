const Grid: React.FC<{
    classes?: string[]
}> = ({
    classes
}) => {
    return (
        <svg className={classes ? classes.join(" ") : ""} fill="#FFFFFF" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
            <path d="M1740 0c99.24 0 180 80.76 180 180v1560c0 99.24-80.76 180-180 180H180c-99.24 0-180-80.76-180-180V180C0 80.76 80.76 0 180 0h1560Zm-420 1200h480V720h-480v480Zm480 540v-420h-480v480h420c33 0 60-27 60-60ZM720 1200h480V720H720v480Zm0 600h480v-480H720v480Zm-600-600h480V720H120v480Zm480 600v-480H120v420c0 33 27 60 60 60h420Z" fillRule="evenodd" />
        </svg>
    );
}

export default Grid;