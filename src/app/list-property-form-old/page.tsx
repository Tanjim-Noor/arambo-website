
import Form from "@/components/list-property/Form"

const page = () => {
    return (
        <div className="px-4 bg-Arambo-Background">
            <div className=" h-[296px] text-center rounded-2xl bg-[linear-gradient(180deg,#000B26_0%,#00123C_19.69%,#032471_70.33%,#0C39A3_86.64%,#0041D9_100%)] flex justify-center items-center">
                <h1 className="h1 text-Arambo-White">List Your Property</h1>
            </div>
            <div className="py-20 bg-Arambo-Background flex justify-center items-center ">
                <Form />
            </div>
        </div>
    )
}

export default page
