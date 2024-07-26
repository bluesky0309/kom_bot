import { komAPI } from './utils'

/**
 * @param address user walllet address
 * @param status project type "upcoming", "active", "ended", "vesting"
 * @returns
 */
export const getProjects = async (status: string, address: string = '', keyword: string = '', invested: boolean = false) => {
    try {
        const { status: _status, result }: { status: string; result: any } = await komAPI(`${process.env.KOM_API_URL}/launchpad/project/?status=${status}&address=${address}&invested=${invested}`)
        if (_status === 'success') {
            return result.filter((r: any) => r?.name?.toLowerCase()?.includes(keyword?.toLocaleLowerCase()));
        } else {
            throw ''
        }
    } catch (err) {
        return []
    }
}
