// create the animations timelines
const tlLeave = gsap.timeline({
    defaults: { duration: 1, ease: "Power2.easeOut" },
});

const tlEnter = gsap.timeline({
    defaults: { duration: 1, ease: "Power2.easeOut" },
});

// Make the animation functions for the leave and enter
const leaveAnimation = (current, done) => {
    const productImage = current.querySelector(".showcase__img-container");
    const text = current.querySelector(".showcase__text");
    const circles = current.querySelectorAll(".circle");
    console.log(circles);
    const arrow = current.querySelector(".next-btn");

    return (
        tlLeave.fromTo(
            arrow,
            { opacity: 1, y: 0 },
            {
                opacity: 0,
                y: 200,
                onComplete: done,
            }
        ),
        tlLeave.fromTo(text, { opacity: 1, x: 0 }, { opacity: 0, x: 200 }, "<"),
        tlLeave.fromTo(
            productImage,
            { y: 0, opacity: 1 },
            { y: -100, opacity: 0 },
            "<"
        ),
        tlLeave.fromTo(
            circles,
            { y: 0, opacity: 1 },
            {
                y: -200,
                opacity: 0,
                stagger: 0.2,
                ease: "back.out(1.7)",
                duration: 1,
            },
            "<"
        )
    );
};
const enterAnimation = (current, done, gradient) => {
    const productImage = current.querySelector(".showcase__img-container");
    const text = current.querySelector(".showcase__text");
    const circles = current.querySelectorAll(".circle");
    const arrow = current.querySelector(".next-btn");

    return (
        tlEnter.fromTo(
            arrow,
            { opacity: 0, y: 200 },
            { opacity: 1, y: 0, onComplete: done }
        ),
        tlEnter.to("body", { background: gradient }, "<"),
        tlEnter.fromTo(text, { opacity: 0, x: 200 }, { opacity: 1, x: 0 }, "<"),
        tlEnter.fromTo(
            productImage,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1 },
            "<"
        ),
        tlEnter.fromTo(
            circles,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.2, ease: "back.out(1.7)" },
            "<"
        )
    );
};

const productEnterAnimation = (next, done) => {
    return (
        tlEnter.fromTo(next, { y: "100%" }, { y: "0%", onComplete: done }),
        tlEnter.fromTo(
            ".card",
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, onCompelete: done },
            "<"
        )
    );
};

const productLeaveAnimation = (current, done) => {
    return tlLeave.fromTo(
        current,
        { y: "0%" },
        { y: "100%", onCompelete: done }
    );
};
barba.init({
    // sync property make the enter and leave animation play together at the same time
    preventRunning: true,
    transitions: [
        {
            name: "default",
            // this once hook fired when we refrech the page
            once(data) {
                const done = this.async();
                let next = data.next.container;
                let gradient = getGradient(data.next.namespace);
                gsap.set("body", { background: gradient });
                gsap.set("nav", {
                    background: "transparent",
                });
                gsap.set("products-nav", {
                    background: "linear-gradient(260deg,#b75d62,#754d4f)",
                });
                enterAnimation(next, done, gradient);
            },
            leave(data) {
                // when we call the done function the enter animation will fire
                const done = this.async();
                let current = data.current.container;
                leaveAnimation(current, done);
            },
            enter(data) {
                // create your amazing enter animation here
                const done = this.async();
                let next = data.next.container;
                const gradient = getGradient(data.next.namespace);
                enterAnimation(next, done, gradient);

                done();
            },
        },
        {
            name: "product-transition",
            sync: true,
            from: { namespace: ["handbag", "products"] },
            to: { namespace: ["products", "handbag"] },
            enter(data) {
                const done = this.async();
                let next = data.next.container;
                productEnterAnimation(next, done);
            },
            leave(data) {
                const done = this.async();
                let current = data.current.container;
                productLeaveAnimation(current, done);
            },
        },
    ],
});

const getGradient = (name) => {
    switch (name) {
        case "handbag":
            return "linear-gradient(260deg,#b75d62,#754d4f)";
        case "boot":
            return "linear-gradient(260deg,#5d8cb7,#4c4f70)";
        case "hat":
            return "linear-gradient(260deg,#b27a5c,#7f5450)";
    }
};
